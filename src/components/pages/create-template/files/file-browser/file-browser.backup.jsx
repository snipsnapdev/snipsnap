import classNames from 'classnames/bind';
import { cloneDeep } from 'lodash';
import React from 'react';

import TreeRecursive from 'components/pages/create-template/files/file-browser/tree-recursive';
import useForceRender from 'hooks/use-force-render';

import styles from './file-browser.module.scss';

const cx = classNames.bind(styles);

let id = 1;
const addIdsToFiles = (file) => ({
  type: file.type,
  data: {
    ...file.data,
    id: id++,
    ...(file.data.files ? { files: file.data.files.map((ch) => addIdsToFiles(ch)) } : {}),
  },
});

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

const FileBrowser = ({ files }) => {
  console.log('File browser RERENDER');
  const dataRef = React.useRef([]);

  const forceRender = useForceRender();
  const setData = (newData) => {
    dataRef.current = newData;
    forceRender();
  };

  React.useEffect(() => {
    const filesWithIds = files.map(addIdsToFiles);
    sortFiles(filesWithIds);
    setData(filesWithIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteFile = (fileId) => {
    const data = dataRef.current;
    const newData = cloneDeep(data);
    const filePath = findFolderPathByKey(newData, fileId);
    // if file/folder in root directory
    if (filePath.length === 1) {
      setData(newData.filter((item) => item.data.id !== fileId));
      // if has parent folder
    } else {
      const parentFolder = filePath[filePath.length - 2];
      parentFolder.data.files = parentFolder.data.files.filter((item) => item.data.id !== fileId);
      setData(newData);
    }
  };

  const treeRef = React.useRef();
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = React.useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((evt) => {
    evt.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileDrop = (evt) => {
    // Prevent file from being opened
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s) - might contain directories, but doesn't work in IE and Safari
      for (let i = 0; i < evt.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (evt.dataTransfer.items[i].kind === 'file') {
          const file = evt.dataTransfer.items[i].getAsFile();

          return new Promise((resolve) => {
            const reader = new window.FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              const newFile = {
                type: 'file',
                data: {
                  name: file.name,
                  content: fileContent,
                },
              };
              resolve(newFile);
            };
            reader.readAsText(file);
          });
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
        const file = evt.dataTransfer.files[i];
        return new Promise((resolve) => {
          const reader = new window.FileReader();
          reader.onload = () => {
            const fileContent = reader.result;
            const newFile = {
              type: 'file',
              data: {
                name: file.name,
                content: fileContent,
              },
            };
            resolve(newFile);
          };
          reader.readAsText(file);
        });
      }
    }
  };

  const handleAddFile = async (folderId, evt) => {
    const data = dataRef.current;

    const newFile = await handleFileDrop(evt);

    if (newFile) {
      // no parent folder - add to root
      if (!folderId) {
        const newData = [...data, newFile];
        sortFiles(newData);
        setData(newData);
      } else {
        const newData = cloneDeep(data);
        const folderPath = findFolderPathByKey(newData, folderId);
        const lastFolder = folderPath[folderPath.length - 1];
        lastFolder.data.files.push(newFile);
        sortFiles(lastFolder.data.files);
        setData(newData);
      }
    }
  };

  React.useEffect(() => {
    const treeElem = treeRef.current;

    const dropHandler = (evt) => {
      handleAddFile(null, evt);
      setIsDragOver(false);
    };

    treeElem.addEventListener('dragover', handleDragOver);
    treeElem.addEventListener('dragleave', handleDragLeave);
    treeElem.addEventListener('dragexit', handleDragLeave);
    treeElem.addEventListener('drop', dropHandler);

    return () => {
      treeElem.removeEventListener('dragover', handleDragOver);
      treeElem.removeEventListener('dragleave', handleDragLeave);
      treeElem.removeEventListener('dragexit', handleDragLeave);
      treeElem.removeEventListener('drop', dropHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDragOver, handleDragLeave]);

  return (
    <div className={cx('wrapper', isDragOver && 'wrapper-dragover')} ref={treeRef}>
      <TreeRecursive
        data={dataRef.current}
        parentDragOverHandler={handleDragOver}
        parentDragLeaveHandler={handleDragLeave}
        dropHandler={handleAddFile}
        parentId={null}
        level={0}
        onItemDelete={handleDeleteFile}
      />
    </div>
  );
};

export default FileBrowser;
