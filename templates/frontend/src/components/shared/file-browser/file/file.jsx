import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import RenameItemModal from 'components/shared/file-browser/rename-item-modal';
import { useFiles } from 'contexts/files-provider';
import DotsIcon from 'icons/dots.inline.svg';
import { getIconByFilename } from 'utils/language';

import DeleteFileModal from '../delete-file-modal';

import styles from './file.module.scss';

const cx = classNames.bind(styles);

// use icons from https://github.com/vscode-icons/vscode-icons/tree/master/icons

const File = ({
  file,
  onOpen,
  onDragOver,
  onDragLeave,
  onDelete,
  onDragStart,
  onDragEnd,
  onRenameItem,
  level,
  readOnly,
}) => {
  const fileRef = useRef();

  const {
    state: { openFileId },
  } = useFiles();

  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState(false);
  const [isRenameItemModalOpen, setIsRenameItemModalOpen] = useState(false);

  useEffect(() => {
    const fileElem = fileRef.current;
    fileElem.addEventListener('dragover', onDragOver);
    fileElem.addEventListener('dragleave', onDragLeave);
    fileElem.addEventListener('dragexit', onDragLeave);

    return () => {
      fileElem.removeEventListener('dragover', onDragOver);
      fileElem.removeEventListener('dragleave', onDragLeave);
      fileElem.removeEventListener('dragexit', onDragLeave);
    };
  }, [onDragLeave, onDragOver]);

  const handleClick = (evt) => {
    evt.stopPropagation();
    onOpen(file);
  };

  const handleDelete = () => {
    onDelete(file.id);
  };

  const handleDragStart = (evt) => {
    onOpen(null);
    evt.preventDefault();
    evt.stopPropagation();
    onDragStart(file);
  };

  const Icon = getIconByFilename(file.data.name);
  const menuItems = [
    {
      text: 'Rename',
      onClick: () => setIsRenameItemModalOpen(true),
    },
    {
      text: 'Delete',
      onClick: () => setIsDeleteFileModalOpen(true),
      theme: 'danger',
    },
  ];
  return (
    <div
      ref={fileRef}
      className={cx('wrapper', file.id === openFileId && 'wrapper-selected')}
      draggable="true"
      style={{ paddingLeft: 25 + 25 * level }}
      onClick={handleClick}
      onDrag={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {isDeleteFileModalOpen && (
        <DeleteFileModal
          name={file.data.name}
          isOpen={isDeleteFileModalOpen}
          onClose={() => setIsDeleteFileModalOpen(false)}
          onSave={handleDelete}
        />
      )}
      {isRenameItemModalOpen && (
        <RenameItemModal
          label="file"
          name={file.data.name}
          isOpen={isRenameItemModalOpen}
          onSave={(newName) => onRenameItem(newName, file.id)}
        />
      )}
      <div className={cx('file-icon')} style={{ left: 7 + 25 * level }}>
        <Icon />
      </div>
      {file.data.name}
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
  );
};

export default File;
