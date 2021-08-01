import classNames from 'classnames/bind';
import { chain, compact, isEmpty, map } from 'lodash';
import React from 'react';

import Button from 'components/shared/button';
import TreeRecursive from 'components/shared/file-browser/tree-recursive';
import { useFiles } from 'contexts/files-provider';
import { getLanguageByFilename } from 'utils/language';

import styles from './file-browser.module.scss';
import FileSvg from './images/file.inline.svg';

const cx = classNames.bind(styles);

const FileBrowser = ({ readOnly = false, onCreateManually, className }) => {
  const {
    state: { files },
    filesDispatch,
  } = useFiles();

  const treeRef = React.useRef();
  const [isDragOver, setIsDragOver] = React.useState(false);

  const draggedItemRef = React.useRef(null);

  /** Handles dragging elements within the tree */
  const handleDragStart = (item) => {
    draggedItemRef.current = item;
  };

  const handleDragEnd = () => {
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
                language: getLanguageByFilename(item.name).label,
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
    // dragged folder or file within the tree
    if (draggedItemRef.current) {
      filesDispatch({
        type: 'moveItem',
        item: draggedItemRef.current,
        newFolderId: folderId,
      });
      handleDragEnd();
      return;
    }

    try {
      const newFiles = await handleFileDrop(evt);
      // Return if newFiles is not an array or empty array or an array with undefined(s) and null(s)
      if (!Array.isArray(newFiles) || isEmpty(compact(newFiles))) return;

      newFiles.forEach((file) =>
        filesDispatch({
          type: 'addItem',
          data: file,
          parentFolderId: folderId,
        })
      );
    } catch (error) {
      throw new Error(`Error while trying to add new files: ${error}`);
    }
  };

  const handleAddFile = (fileName, parentFolderId) => {
    filesDispatch({
      type: 'addItem',
      data: {
        name: fileName,
        language: getLanguageByFilename(fileName).label,
        content: '',
      },
      parentFolderId,
    });
  };

  const handleAddFolder = (folderName, parentFolderId) => {
    filesDispatch({
      type: 'addItem',
      data: {
        name: folderName,
        files: [],
      },
      parentFolderId,
    });
  };

  const handleRenameItem = (newName, itemId) => {
    filesDispatch({
      type: 'renameItem',
      itemId,
      newName,
    });
  };

  const handleDeleteItem = (itemId) => {
    filesDispatch({
      type: 'deleteItem',
      itemId,
    });
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

  const handleOpenFile = (file) =>
    filesDispatch({
      type: 'openFile',
      fileId: file ? file.id : null,
    });

  const noop = () => {};

  return (
    <div className={cx('wrapper', isDragOver && 'wrapper-dragover', className)} ref={treeRef}>
      {files.length ? (
        <TreeRecursive
          data={files}
          parentDragOverHandler={handleDragOver}
          parentDragLeaveHandler={handleDragLeave}
          parentId={null}
          level={0}
          readOnly={readOnly}
          onAddFile={!readOnly ? handleAddFile : noop}
          onAddFolder={!readOnly ? handleAddFolder : noop}
          onDropFile={!readOnly ? handleDropFile : noop}
          onRenameItem={!readOnly ? handleRenameItem : noop}
          onItemDelete={!readOnly ? handleDeleteItem : noop}
          onOpenFile={handleOpenFile}
          onDragStart={!readOnly ? handleDragStart : noop}
          onDragEnd={!readOnly ? handleDragEnd : noop}
        />
      ) : (
        <div className={cx('empty')}>
          <FileSvg />
          <div>
            Drag and drop files or{' '}
            <Button tag="a" themeType="link" size="md" onClick={onCreateManually}>
              Create manually
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileBrowser;
