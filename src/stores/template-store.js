import { cloneDeep, compact } from 'lodash';
import React from 'react';
import { v4 as uuid } from 'uuid';

const systemFileNames = ['.DS_Store'];

const createFile = (data) => {
  if (systemFileNames.some((systemFileName) => data.name === systemFileName)) return;

  return {
    type: 'file',
    id: uuid(),
    data,
  };
};

const createFolder = (data) => ({
  type: 'folder',
  id: uuid(),
  data: {
    ...data,
    files: compact(data.files.map((item) => (item.files ? createFolder(item) : createFile(item)))),
  },
});

/** UI state for the currently opened template */
export default class TemplateStore {
  constructor(files = []) {
    if (typeof window !== 'undefined') {
      window.templateStore = this;
    }

    this.openFileId = null;

    this.data = {
      files: files.map(addIds),
    };

    this.updateCallbacks = [];
  }

  initWithEmpty() {
    this.data = {
      files: [],
    };
  }

  openFile(fileId) {
    console.log('store open file', fileId);
    this.openFileId = fileId;
    this.notifyUpdateListeners();
  }

  getOpenFile() {
    if (!this.openFileId) {
      return null;
    }
    return findFileById(this.data.files, this.openFileId);
  }

  getOpenFilePath() {
    if (!this.openFileId) {
      return null;
    }

    const path = findFolderPathByKey(this.data.files, this.openFileId);
    return path ? path.map((item) => item.data.name).join('/') : null;
  }

  setOpenFileContent(content) {
    const file = this.getOpenFile();
    if (!file) {
      return;
    }
    file.data.content = content;
  }

  getFiles() {
    return this.data.files;
  }

  addFile(data, parentFolderId = null) {
    if (systemFileNames.some((systemFileName) => data.name === systemFileName)) return;

    const file = createFile(data);

    // no parent folder - add to root
    if (!parentFolderId) {
      this.data.files.push(file);
      sortFiles(this.data.files);
    } else {
      const newData = cloneDeep(this.data.files);
      const folderPath = findFolderPathByKey(newData, parentFolderId);
      const lastFolder = folderPath[folderPath.length - 1];
      lastFolder.data.files.push(file);
      sortFiles(lastFolder.data.files);
      this.data.files = newData;
    }

    this.openFile(file.id);
    this.notifyUpdateListeners();
    return file;
  }

  addFiles(data, parentFolderId = null) {
    return data.map((item) => this.addFile(item, parentFolderId));
  }

  addFolder(data, parentFolderId = null) {
    // we could pass data with or without id
    const folder = data.id !== undefined ? { ...data, type: 'folder' } : createFolder(data);

    // no parent folder - add to root
    if (!parentFolderId) {
      this.data.files.push(folder);
      sortFiles(this.data.files);
    } else {
      const newData = cloneDeep(this.data.files);
      const folderPath = findFolderPathByKey(newData, parentFolderId);
      const lastFolder = folderPath[folderPath.length - 1];
      lastFolder.data.files.push(folder);
      sortFiles(lastFolder.data.files);
      this.data.files = newData;
    }

    this.notifyUpdateListeners();
    return folder;
  }

  addFoldersAndFiles(data, parentFolderId = null) {
    return data.map((item) => {
      // it's a folder
      if (item.files) {
        return this.addFolder(createFolder(item), parentFolderId);
      }
      // it's a file
      return this.addFile(item, parentFolderId);
    });
  }

  renameFolder(newName, folderId) {
    const newData = cloneDeep(this.data.files);
    const filePath = findFolderPathByKey(newData, folderId);
    // if file/folder in root directory
    if (filePath.length === 1) {
      this.data.files = newData.map((item) =>
        item.id === folderId ? { ...item, data: { ...item.data, name: newName } } : item
      );
      // if has parent folder
    } else {
      const parentFolder = filePath[filePath.length - 2];
      parentFolder.data.files = parentFolder.data.files.map((item) =>
        item.id === folderId ? { ...item, data: { ...item.data, name: newName } } : item
      );
      this.data.files = newData;
    }
    this.notifyUpdateListeners();
  }

  deleteFile(fileId) {
    const newData = cloneDeep(this.data.files);
    const filePath = findFolderPathByKey(newData, fileId);
    // if file/folder in root directory
    if (filePath.length === 1) {
      this.data.files = newData.filter((item) => item.id !== fileId);
      // if has parent folder
    } else {
      const parentFolder = filePath[filePath.length - 2];
      parentFolder.data.files = parentFolder.data.files.filter((item) => item.id !== fileId);
      this.data.files = newData;
    }

    if (fileId === this.openFile) {
      this.openFile = null;
      this.openFileId = null;
    }

    this.notifyUpdateListeners();
  }

  formatFilesDataForApi() {
    return this.data.files.map(removeIds);
  }

  formatFilesDataFromApi() {
    return this.data.files.map(addIds);
  }

  // Notify update listeneres (e.g. to make React re-render components)
  addUpdateCallback(cb) {
    this.updateCallbacks.push(cb);
  }

  removeUpdateCallback(cb) {
    this.updateCallbacks = this.updateCallbacks.filter((cb2) => cb !== cb2);
  }

  notifyUpdateListeners() {
    this.updateCallbacks.forEach((cb) => cb());
  }
}

export const TemplateStoreContext = React.createContext(null);

export const useTemplateStore = () => {
  const store = React.useContext(TemplateStoreContext);
  const [renderKey, setRenderKey] = React.useState({});
  const updateCallback = () => setRenderKey({});

  React.useEffect(() => {
    store.addUpdateCallback(updateCallback);
    return () => store.removeUpdateCallback(updateCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
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

/** Find file by id */
const findFileById = (items, fileId) => {
  for (const item of items) {
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
