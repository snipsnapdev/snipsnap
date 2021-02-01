import classNames from 'classnames/bind';
import React from 'react';

import TreeRecursive from 'components/pages/create-template/files/file-browser/tree-recursive';
import { useTemplateStore } from 'stores/template-store';

import styles from './file-browser.module.scss';

const cx = classNames.bind(styles);

const FileBrowser = () => {
  const store = useTemplateStore();
  const files = store.getFiles();

  console.log('RENDER: File browse', files);
  const dataRef = React.useRef([]);

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
    // TODO
  };

  const handleDeleteFile = (fileId) => {
    store.deleteFile(fileId);
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
        data={files}
        parentDragOverHandler={handleDragOver}
        parentDragLeaveHandler={handleDragLeave}
        dropHandler={handleAddFile}
        parentId={null}
        level={0}
        onItemDelete={handleDeleteFile}
        onOpenFile={(file) => store.openFile(file.id)}
      />
    </div>
  );
};

export default FileBrowser;
