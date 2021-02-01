import React from 'react';
import { v4 as uuid } from 'uuid';

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
    return this.data.files.find((f) => f.id === this.openFileId);
  }

  setOpenFileContent(content) {
    const file = this.getOpenFile();
    console.log('TemplateStore.setOpenFileContent', content, file);
    if (!file) {
      return;
    }
    file.data.content = content;
  }

  addFile(data) {
    console.log('TemplateStore.addFile', data);
    const file = {
      type: 'file',
      id: uuid(),
      data,
    };
    this.data.files.push(file);
    this.notifyUpdateListeners();
    return file;
  }

  getFiles() {
    return this.data.files;
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

// Find path to folder with id=folderId
const findFolderPathByKey = (data, folderId, path = []) => {
  for (const item of data) {
    if (item.data.id === folderId) {
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

// folders first
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
