import React from 'react';
import TreeRecursive from 'components/file-browser/tree-recursive';
import classNames from 'classnames/bind';
import DeleteIcon from '../icons/cross.svg';
import FolderIcon from '../icons/folder.svg';
import Chevron from '../icons/chevron-down.svg';

import styles from './folder.module.scss';

const cx = classNames.bind(styles);

const Folder = ({ folder, handleDrop, onDelete }) => {
  const folderRef = React.useRef();
  const [isOpen, setIsOpen] = React.useState(true);
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
  return (
    <div
      ref={folderRef}
      style={{ backgroundColor: isDragOver ? 'blue' : 'transparent' }}
      className={cx('folder')}
    >
      <div className={styles.wrapper}>
        <span className={cx('folder-title')}>
          <FolderIcon className={cx('icon-folder')} />
          <button
            className={cx('button-collapse')}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span>{folder.name}</span>
            <Chevron className={cx(isOpen ? 'icon-open' : 'icon-close')} />
          </button>
        </span>
        <button className={cx('button-delete')} onClick={() => onDelete(folder.id)}>
          <DeleteIcon className={cx('icon')} />
        </button>
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
            onItemDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Folder;
