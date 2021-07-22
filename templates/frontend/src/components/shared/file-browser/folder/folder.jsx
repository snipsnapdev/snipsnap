import classNames from 'classnames/bind';
import { useState, useEffect, useCallback, useRef } from 'react';

import Dropdown from 'components/shared/dropdown';
import AddFileModal from 'components/shared/file-browser/add-file-modal';
import AddFolderModal from 'components/shared/file-browser/add-folder-modal';
import DeleteFolderModal from 'components/shared/file-browser/delete-folder-modal';
import RenameItemModal from 'components/shared/file-browser/rename-item-modal';
import TreeRecursive from 'components/shared/file-browser/tree-recursive';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsIcon from 'icons/dots.inline.svg';

import styles from './folder.module.scss';

const cx = classNames.bind(styles);

const Folder = ({
  folder,
  onDropFile,
  onDelete,
  onOpenFile,
  onAddFile,
  onAddFolder,
  onRenameFolder,
  onDragStart,
  onDragEnd,
  level,
  readOnly,
}) => {
  const folderRef = useRef();
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((evt) => {
    evt.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileDrop = useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onDropFile(folder.id, evt);
    setIsDragOver(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragStart = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onDragStart(folder);
  };

  useEffect(() => {
    const folderElem = folderRef.current;

    folderElem.addEventListener('dragover', handleDragOver);
    folderElem.addEventListener('dragleave', handleDragLeave);
    folderElem.addEventListener('dragexit', handleDragLeave);
    folderElem.addEventListener('drop', handleFileDrop);

    return () => {
      folderElem.removeEventListener('dragover', handleDragOver);
      folderElem.removeEventListener('dragleave', handleDragLeave);
      folderElem.removeEventListener('dragexit', handleDragLeave);
      folderElem.removeEventListener('drop', handleFileDrop);
    };
  }, [handleDragLeave, handleDragOver, handleFileDrop]);

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isRenameItemModalOpen, setIsRenameItemModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);

  const menuItems = [
    {
      text: 'Add file',
      onClick: () => setIsAddFileModalOpen(true),
    },
    {
      text: 'Add folder',
      onClick: () => setIsAddFolderModalOpen(true),
    },
    {
      text: 'Rename',
      onClick: () => setIsRenameItemModalOpen(true),
    },
    {
      text: 'Delete',
      onClick: () => setIsDeleteFolderModalOpen(true),
      theme: 'danger',
    },
  ];

  return (
    <div
      ref={folderRef}
      className={cx('folder', isDragOver && 'folder-dragover')}
      draggable="true"
      onDrag={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={cx('folder-line')} style={{ left: 15 + 25 * level }} />
      <div className={styles.wrapper}>
        <button
          className={cx('folder-title')}
          style={{ paddingLeft: 10 + 25 * level }}
          onClick={(event) => {
            event.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <ArrowSvg className={cx('arrow', isOpen && 'open')} />
          <span className={cx('folder-name')}>{folder.data.name}</span>
        </button>
        {!readOnly && (
          <Dropdown
            menuItems={menuItems}
            className={cx('options')}
            position="top-right"
            menuClassName={cx('options-menu')}
            stopPropagation
          >
            <DotsIcon className={cx('options-icon')} />
          </Dropdown>
        )}
      </div>
      {isAddFileModalOpen && (
        <AddFileModal
          isOpen={isAddFileModalOpen}
          onClose={() => setIsAddFileModalOpen(false)}
          onSave={(fileName) => onAddFile(fileName, folder.id)}
        />
      )}
      {isAddFolderModalOpen && (
        <AddFolderModal
          isOpen={isAddFolderModalOpen}
          onClose={() => setIsAddFolderModalOpen(false)}
          onSave={(folderName) => onAddFolder(folderName, folder.id)}
        />
      )}
      {isRenameItemModalOpen && (
        <RenameItemModal
          name={folder.data.name}
          isOpen={isRenameItemModalOpen}
          onClose={() => setIsRenameItemModalOpen(false)}
          onSave={(newName) => onRenameFolder(newName, folder.id)}
        />
      )}
      {isDeleteFolderModalOpen && (
        <DeleteFolderModal
          name={folder.data.name}
          isOpen={isDeleteFolderModalOpen}
          onClose={() => setIsDeleteFolderModalOpen(false)}
          onSave={() => onDelete(folder.id)}
        />
      )}
      <div className={cx('collapsible', !isOpen && 'collapsible-hidden')}>
        {/* Call the <TreeRecursive /> component with the current item.childrens */}
        {folder.data.files && folder.data.files.length > 0 && (
          <TreeRecursive
            data={folder.data.files}
            parentDragOverHandler={handleDragOver}
            parentDragLeaveHandler={handleDragLeave}
            parentId={folder.id}
            level={level + 1}
            readOnly={readOnly}
            onItemDelete={onDelete}
            onDropFile={onDropFile}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onOpenFile={onOpenFile}
            onRenameFolder={onRenameFolder}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        )}
      </div>
    </div>
  );
};

export default Folder;
