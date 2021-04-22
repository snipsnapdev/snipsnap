import React, { useContext, useReducer } from 'react';

import {
  addItem,
  moveItem,
  renameFolder,
  deleteItem,
  changeFileContent,
  changeFileLanguage,
} from 'utils/files-provider-helpers';

const initialState = {
  openFileId: null,
  files: [],
};

export const FilesContext = React.createContext(null);

export const useFiles = () => useContext(FilesContext);

export const filesReducer = (state, action) => {
  switch (action.type) {
    case 'addItem':
      return {
        ...state,
        ...addItem({
          files: state.files,
          data: action.data,
          parentFolderId: action.parentFolderId,
        }),
      };
    case 'moveItem':
      return {
        ...state,
        ...moveItem({ files: state.files, item: action.item, newFolderId: action.newFolderId }),
      };
    case 'renameFolder':
      return {
        ...state,
        ...renameFolder({ files: state.files, folderId: action.folderId, newName: action.newName }),
      };
    case 'deleteItem':
      return {
        ...state,
        ...deleteItem({
          files: state.files,
          itemId: action.itemId,
          isFileOpen: action.itemId === state.openFileId,
        }),
      };
    case 'openFile':
      return { ...state, openFileId: action.fileId };
    case 'changeOpenFileContent': {
      return { ...state, files: changeFileContent(state.files, state.openFileId, action.value) };
    }
    case 'changeOpenFileLanguage': {
      return {
        ...state,
        files: changeFileLanguage(state.files, state.openFileId, action.newLanguage),
      };
    }
    case 'reset': {
      return {
        ...state,
        ...action.data,
      };
    }
    default:
      return state;
  }
};

const FilesProvider = ({ children }) => {
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
