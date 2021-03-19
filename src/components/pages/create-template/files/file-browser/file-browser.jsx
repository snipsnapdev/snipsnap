import classNames from 'classnames/bind';
import { chain, compact, isEmpty, map } from 'lodash';
import React from 'react';

import TreeRecursive from 'components/pages/create-template/files/file-browser/tree-recursive';
import { useTemplateStore } from 'stores/template-store';

import styles from './file-browser.module.scss';

const cx = classNames.bind(styles);

const FileBrowser = () => {
  const store = useTemplateStore();
  const files = store.getFiles();

  const treeRef = React.useRef();
  const [isDragOver, setIsDragOver] = React.useState(false);

  const draggedItemRef = React.useRef(null);

  /** Handles dragging elements within the tree */
  const handleDragStart = (item) => {
    draggedItemRef.current = item;
  };

  const handleDragEnd = () => {
    console.log('STOP DRAG');
    draggedItemRef.current = null;
  };

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

    // Primarily trying to use DataTransfer.items if available. If not, then trying to use DataTransfer.files
    // DataTransfer.items might contain directories and doesn't work in IE and Safari
    const items = evt.dataTransfer.items || evt.dataTransfer.files;

    if (!items || !items.length) return Promise.reject(new Error('No files are presented'));

    async function handleFiles(item) {
      if (item.isFile) {
        return new Promise((resolve, reject) =>
          item.file((file) => {
            const reader = new window.FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              const newFile = {
                name: item.name,
                content: fileContent,
              };
              resolve(newFile);
            };
            reader.readAsText(file);
          }, reject)
        );
      }

      if (item.isDirectory) {
        const reader = item.createReader();
        const files = await new Promise((resolve, reject) =>
          reader.readEntries((items) => resolve(Promise.all(map(items, handleFiles))), reject)
        );

        return {
          name: item.name,
          files,
        };
      }

      return null;
    }

    return Promise.all(
      chain(items)
        // If dropped items aren't files, reject them
        .filter((item) => item.kind === 'file')
        .map((item) => item.webkitGetAsEntry())
        .map(handleFiles)
    );
  };

  const handleDropFile = async (folderId, evt) => {
    if (draggedItemRef.current) {
      store.dragAndDrop(draggedItemRef.current, folderId);
      handleDragEnd();
      return;
    }

    try {
      const newFiles = await handleFileDrop(evt);
      // Return if newFiles is not an array or empty array or an array with undefined(s) and null(s)
      if (!Array.isArray(newFiles) || isEmpty(compact(newFiles))) return;
      store.addFoldersAndFiles(newFiles, folderId);
    } catch (error) {
      console.log('Error while trying to add new files: ', error);
    }
  };

  const handleAddFile = (fileName, parentFolderId) => {
    const fileData = {
      name: fileName,
      language: 'javascript',
      content: '',
    };
    store.addFile(fileData, parentFolderId);
  };

  const handleAddFolder = (folderName, parentFolderId) => {
    const folderData = {
      name: folderName,
      files: [],
    };
    store.addFolder(folderData, parentFolderId);
  };

  const handleRenameFolder = (newFolderName, folderId) => {
    store.renameFolder(newFolderName, folderId);
  };

  const handleDeleteFile = (fileId) => {
    store.deleteFile(fileId);
  };

  React.useEffect(() => {
    const treeElem = treeRef.current;

    const dropHandler = (evt) => {
      handleDropFile(null, evt);
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
        parentId={null}
        level={0}
        onAddFile={handleAddFile}
        onAddFolder={handleAddFolder}
        onDropFile={handleDropFile}
        onRenameFolder={handleRenameFolder}
        onItemDelete={handleDeleteFile}
        onOpenFile={(file) => (file ? store.openFile(file.id) : store.openFile(null))}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default FileBrowser;
