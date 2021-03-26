import { clone, cloneDeep, compact } from 'lodash';
import React, { useContext, useReducer } from 'react';
import { v4 as uuid } from 'uuid';

const systemFileNames = ['.DS_Store'];

export const FilesContext = React.createContext(null);

export const useFiles = () => useContext(FilesContext);

export const filesReducer = (state, action) => {
  switch (action.type) {
    case 'addItem':
      return {
        ...state,
        files: addFolderOrFile(state.files, action.data, action.parentFolderId),
      };
    case 'moveItem':
      return {
        ...state,
        files: moveItem(state.files, action.item, action.newFolderId),
      };
    case 'renameFolder':
      return {
        ...state,
        files: renameFolder(state.files, action.folderId, action.newName),
      };
    case 'deleteItem':
      return {
        ...state,
        files: deleteItem(state.files, action.itemId),
      };
    case 'openFile':
      return { ...state, openFileId: action.fileId };
    default:
      return state;
  }
};

const FilesProvider = ({ children }) => {
  const initialState = {
    openFileId: null,
    files: [],
  };
  const [filesState, dispatch] = useReducer(filesReducer, initialState);
  return (
    <FilesContext.Provider
      value={{ openFile: filesState.openFileId, files: filesState.files, dispatch }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export default FilesProvider;

// move to helpers later:

/** Add file to folder with id=parentFolderId or to the root */
const addFile = (files, fileData, parentFolderId = null) => {
  if (systemFileNames.some((systemFileName) => fileData.name === systemFileName)) return;

  console.log('addFile', files);
  const newFiles = cloneDeep(files);
  const file = createFile(fileData);

  // no parent folder - add to root
  if (!parentFolderId) {
    newFiles.push(file);
    sortFiles(newFiles);
  } else {
    const folderPath = findFolderPathByKey(newFiles, parentFolderId);
    const lastFolder = folderPath[folderPath.length - 1];
    lastFolder.data.files.push(file);
    sortFiles(lastFolder.data.files);
  }

  // TODO: open just added file
  // this.openFile(file.id);

  return newFiles;
};

/** Add folder and its content to folder with id=parentFolderId or to the root */
const addFolder = (files, folderData, parentFolderId = null) => {
  // we could pass data with or without id
  const folder =
    folderData.id !== undefined ? { ...folderData, type: 'folder' } : createFolder(folderData);

  const newFiles = cloneDeep(files);

  // no parent folder - add to root
  if (!parentFolderId) {
    newFiles.push(folder);
    sortFiles(newFiles);
  } else {
    const folderPath = findFolderPathByKey(newFiles, parentFolderId);
    const lastFolder = folderPath[folderPath.length - 1];
    lastFolder.data.files.push(folder);
    sortFiles(lastFolder.data.files);
  }

  return newFiles;
};

const addFolderOrFile = (files, itemData, parentFolderId = null) => {
  if (itemData.files) {
    return addFolder(files, createFolder(itemData), parentFolderId);
  }
  // it's a file
  return addFile(files, itemData, parentFolderId);
};

/** Sort files: folders first, then alphabetically */
const fileComparator = (file1, file2) => {
  if (file1.type === 'file' && file2.type === 'folder') {
    return 1;
  }
  if (file1.type === 'folder' && file2.type === 'file') {
    return -1;
  }
  if (file1.data.name > file2.data.name) {
    return 1;
  }
  return -1;
};

/** Sorts files inplace */
const sortFiles = (files) => {
  files.sort(fileComparator);
  files.filter((item) => item.type === 'folder').forEach((item) => sortFiles(item.data.files));
};

/** creates File structure from uploaded data (adds id and type) */
const createFile = (data) => {
  if (systemFileNames.some((systemFileName) => data.name === systemFileName)) return;

  return {
    type: 'file',
    id: uuid(),
    data,
  };
};

/** creates Folder structure from uploaded data (adds id and type recursively) */
const createFolder = (data) => ({
  type: 'folder',
  id: uuid(),
  data: {
    ...data,
    files: compact(data.files.map((item) => (item.files ? createFolder(item) : createFile(item)))),
  },
});

/** Find path to folder with id=folderId */
const findFolderPathByKey = (data, folderId, path = []) => {
  for (const item of data) {
    if (item.id === folderId) {
      return [...path, item];
    }
    if (item.data.files) {
      const result = findFolderPathByKey(item.data.files, folderId, [...path, item]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/** Find path to parent of item width id=itemId */
const findParentFolderPathByKey = (data, itemId, path = []) => {
  for (const item of data) {
    if (item.id === itemId) {
      return path;
    }
    if (item.data.files) {
      const result = findParentFolderPathByKey(item.data.files, itemId, [...path, item]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

/** changes folder name */
const renameFolder = (files, folderId, newName) => {
  let newData = cloneDeep(files);
  const filePath = findFolderPathByKey(newData, folderId);
  // if file/folder in root directory
  if (filePath.length === 1) {
    newData = newData.map((item) =>
      item.id === folderId ? { ...item, data: { ...item.data, name: newName } } : item
    );
    // if has parent folder
  } else {
    const parentFolder = filePath[filePath.length - 2];
    parentFolder.data.files = parentFolder.data.files.map((item) =>
      item.id === folderId ? { ...item, data: { ...item.data, name: newName } } : item
    );
  }
  return newData;
};

const deleteItem = (files, itemId) => {
  let newData = cloneDeep(files);
  const filePath = findFolderPathByKey(newData, itemId);
  // if file/folder in root directory
  if (filePath.length === 1) {
    newData = newData.filter((item) => item.id !== itemId);
    // if has parent folder
  } else {
    const parentFolder = filePath[filePath.length - 2];
    parentFolder.data.files = parentFolder.data.files.filter((item) => item.id !== itemId);
  }

  // TODO: if deleted file was opened, set opened file to null
  return newData;
};

const moveItem = (files, item, newFolderId = null) => {
  // remove item from old parent folder
  const newFiles = deleteItem(files, item.id);

  // add it to new parent folder
  if (!newFolderId) {
    newFiles.push(item);
    sortFiles(newFiles);
  } else {
    const folderPath = findFolderPathByKey(newFiles, newFolderId);
    const lastFolder = folderPath[folderPath.length - 1];
    lastFolder.data.files.push(item);
    sortFiles(lastFolder.data.files);
  }

  return newFiles;
};

/** Traverse file tree, remove ids */
const removeIds = (item) => {
  if (item.type === 'file') {
    return {
      type: 'file',
      data: item.data,
    };
  }
  return {
    type: 'folder',
    data: {
      ...item.data,
      files: item.data.files.map(removeIds),
    },
  };
};

/** Traverse file tree, add ids */
const addIds = (item) => {
  if (item.type === 'file') {
    return {
      type: 'file',
      id: uuid(),
      data: item.data,
    };
  }
  return {
    type: 'folder',
    id: uuid(),
    data: {
      ...item.data,
      files: item.data.files.map(addIds),
    },
  };
};

const formatFilesDataForApi = (data) => data.map(removeIds);

const formatFilesDataFromApi = (data) => data.map(addIds);
