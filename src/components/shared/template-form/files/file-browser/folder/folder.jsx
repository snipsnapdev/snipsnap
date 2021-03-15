import classNames from 'classnames/bind';
import { useState, useEffect, useCallback, useRef } from 'react';

import Dropdown from 'components/shared/dropdown';
import AddFileModal from 'components/shared/template-form/files/file-browser/add-file-modal';
import AddFolderModal from 'components/shared/template-form/files/file-browser/add-folder-modal';
import DeleteFolderModal from 'components/shared/template-form/files/file-browser/delete-folder-modal';
import RenameFolderModal from 'components/shared/template-form/files/file-browser/rename-folder-modal';
import TreeRecursive from 'components/shared/template-form/files/file-browser/tree-recursive';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import FolderSvg from 'icons/folder.inline.svg';

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
  level,
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
    onDropFile(folder.id, evt);
    setIsDragOver(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);

  const folderMenu = (
    <>
      <div onClick={() => setIsAddFileModalOpen(true)}>Add file</div>
      <div onClick={() => setIsAddFolderModalOpen(true)}>Add folder</div>
      <div onClick={() => setIsRenameFolderModalOpen(true)}>Rename</div>
      <div onClick={() => setIsDeleteFolderModalOpen(true)}>Delete</div>
    </>
  );

  return (
    <div ref={folderRef} className={cx('folder', isDragOver && 'folder-dragover')}>
      <div className={cx('folder-line')} style={{ left: 19 + 25 * level }} />
      <div className={styles.wrapper}>
        <span className={cx('folder-title')} style={{ marginLeft: 10 + 25 * level }}>
          <FolderSvg className={cx('icon-folder')} />
          <button
            className={cx('button-collapse')}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span className={cx('folder-name')}>{folder.data.name}</span>
            <ArrowSvg className={cx(isOpen ? 'icon-open' : 'icon-close')} />
          </button>
        </span>
        <div className={cx('options')}>
          <Dropdown
            menu={folderMenu}
            className={cx('options-inner')}
            position="top-right"
            menuClassName={cx('options-menu')}
            stopPropagation
          >
            <DotsSvg className={cx('options-icon')} />
          </Dropdown>
        </div>
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
      {isRenameFolderModalOpen && (
        <RenameFolderModal
          name={folder.data.name}
          isOpen={isRenameFolderModalOpen}
          onClose={() => setIsRenameFolderModalOpen(false)}
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
            onItemDelete={onDelete}
            onDropFile={onDropFile}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onOpenFile={onOpenFile}
            onRenameFolder={onRenameFolder}
          />
        )}
      </div>
    </div>
  );
};

export default Folder;
