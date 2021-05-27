import { cloneDeep, compact } from 'lodash';
import { v4 as uuid } from 'uuid';

const systemFileNames = ['.DS_Store'];

/** Update content of file with id=fileId */
export const changeFileContent = (files, fileId, newValue) => {
  const newFiles = cloneDeep(files);
  const file = findFileById(newFiles, fileId);
  file.data.content = newValue;

  return newFiles;
};

/** Update language of file with id=fileId */
export const changeFileLanguage = (files, fileId, newLanguage) => {
  const newFiles = cloneDeep(files);
  const file = findFileById(newFiles, fileId);
  file.data.language = newLanguage;

  return newFiles;
};

/** Add file to folder with id=parentFolderId or to the root */
const addFile = (files, fileData, parentFolderId = null) => {
  if (systemFileNames.some((systemFileName) => fileData.name === systemFileName)) return;

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

  return { newFiles, newFileId: file.id };
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

export const addItem = ({ files, data, parentFolderId = null }) => {
  if (data.files) {
    return { files: addFolder(files, createFolder(data), parentFolderId) };
  }
  // it's a file
  const { newFiles, newFileId } = addFile(files, data, parentFolderId);

  return { files: newFiles, openFileId: newFileId };
};

/** Changes folder name */
export const renameFolder = ({ files, folderId, newName }) => {
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
  return { files: newData };
};

export const deleteItem = ({ files, itemId, isFileOpen = false }) => {
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

  // if deleted file was opened, set opened file to null
  if (isFileOpen) {
    return { files: newData, openFileId: null };
  }
  return { files: newData };
};

export const moveItem = ({ files, item, newFolderId = null }) => {
  // remove item from old parent folder
  const newFiles = deleteItem({ files, itemId: item.id }).files;

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

  return { files: newFiles };
};

/** creates File structure from uploaded data (adds id and type) */
export const createFile = (data) => {
  if (systemFileNames.some((systemFileName) => data.name === systemFileName)) return;

  return {
    type: 'file',
    id: uuid(),
    data,
  };
};

/** creates Folder structure from uploaded data (adds id and type recursively) */
export const createFolder = (data) => ({
  type: 'folder',
  id: uuid(),
  data: {
    ...data,
    files: compact(data.files.map((item) => (item.files ? createFolder(item) : createFile(item)))),
  },
});

/** Find path to folder with id=folderId */
export const findFolderPathByKey = (data, folderId, path = []) => {
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
export const findParentFolderPathByKey = (data, itemId, path = []) => {
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

export const findFileById = (files, fileId) => {
  for (const item of files) {
    if (item.id === fileId) {
      return item;
    }
    if (item.data.files) {
      const result = findFileById(item.data.files, fileId);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getFilePath = (files, fileId) => {
  if (!fileId) {
    return null;
  }

  const path = findFolderPathByKey(files, fileId);
  return path ? path.map((item) => item.data.name).join('/') : null;
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
export const sortFiles = (files) => {
  files.sort(fileComparator);
  files.filter((item) => item.type === 'folder').forEach((item) => sortFiles(item.data.files));
};
