import { cloneDeep } from 'lodash';
import React from 'react';
import { v4 as uuid } from 'uuid';

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

/** UI state for the currently opened template */
export default class TemplateStore {
  constructor() {
    window.templateStore = this;

    this.openFileId = null;

    this.data = {
      files: [],
      name: '',
    };

    this.updateCallbacks = [];
  }

  initWithEmpty() {
    this.data = {
      name: '',
      files: [],
    };
  }

  openFile(fileId) {
    console.log('TemplateStore.openFile', fileId);
    this.openFileId = fileId;
    this.notifyUpdateListeners();
  }

  getOpenFile() {
    if (!this.openFileId) {
      return null;
    }
    // return this.data.files.find((f) => f.id === this.openFileId);
    return findFileById(this.data.files, this.openFileId);
  }

  setOpenFileContent(content) {
    const file = this.getOpenFile();
    console.log('TemplateStore.setOpenFileContent', content, file);
    if (!file) {
      return;
    }
    file.data.content = content;
  }

  getFiles() {
    return this.data.files;
  }

  addFile(data, parentFolderId = null) {
    console.log('TemplateStore.addFile', data);
    const file = {
      type: 'file',
      id: uuid(),
      data,
    };

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

    this.notifyUpdateListeners();
    return file;
  }

  addFolder(data, parentFolderId = null) {
    console.log('TemplateStore.addFolder', data);
    const folder = {
      type: 'folder',
      id: uuid(),
      data,
    };

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

  deleteFile(fileId) {
    console.log('TemplateStore.deleteFile', fileId);
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
    this.notifyUpdateListeners();
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
