import classNames from 'classnames/bind';
import React from 'react';

import TreeRecursive from 'components/pages/create-template/files/file-browser/tree-recursive';
import Dropdown from 'components/shared/dropdown';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import FolderSvg from 'icons/folder.inline.svg';

import styles from './folder.module.scss';

const cx = classNames.bind(styles);

const Folder = ({ folder, handleDrop, onDelete, level }) => {
  const folderRef = React.useRef();
  const [isOpen, setIsOpen] = React.useState(true);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDelete = () => onDelete(folder.id);
  const handleAddFile = () => {};
  const handleAddFolder = () => {};

  const handleRenameFolder = () => {};

  const handleDragOver = React.useCallback((evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = React.useCallback((evt) => {
    evt.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileDrop = React.useCallback((evt) => {
    evt.preventDefault();
    console.log('file drop to', folder.id);
    handleDrop(folder.id, evt);
    setIsDragOver(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
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

  const folderMenu = (
    <>
      <div onClick={handleAddFile}>Add file</div>
      <div onClick={handleAddFolder}>Add folder</div>
      <div onClick={handleRenameFolder}>Rename</div>
      <div onClick={handleDelete}>Delete</div>
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
            <span className={cx('folder-name')}>{folder.name}</span>
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
      <div className={cx('collapsible', !isOpen && 'collapsible-hidden')}>
        {/* Call the <TreeRecursive /> component with the current item.childrens */}
        {folder.files && folder.files.length > 0 && (
          <TreeRecursive
            data={folder.files}
            parentDragOverHandler={handleDragOver}
            parentDragLeaveHandler={handleDragLeave}
            dropHandler={handleDrop}
            parentId={folder.id}
            level={level + 1}
            onItemDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Folder;
