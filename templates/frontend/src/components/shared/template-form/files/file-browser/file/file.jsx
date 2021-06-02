import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import { useFiles } from 'contexts/files-provider';
import CloseSvg from 'icons/close.inline.svg';
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
  level,
  readOnly,
}) => {
  const fileRef = useRef();

  const {
    state: { openFileId },
  } = useFiles();

  const [isDeleteFileModalOpen, setIsDeleteFileModalOpen] = useState(false);

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

  const handleDeleteClick = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDeleteFileModalOpen(true);
  };

  const handleDragStart = (evt) => {
    onOpen(null);
    evt.preventDefault();
    evt.stopPropagation();
    onDragStart(file);
  };

  const Icon = getIconByFilename(file.data.name);

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
      <div className={cx('file-icon')} style={{ left: 7 + 25 * level }}>
        <Icon />
      </div>
      {file.data.name}
      {!readOnly && (
        <button className={cx('button-delete')} onClick={handleDeleteClick}>
          <CloseSvg className={cx('icon')} />
        </button>
      )}
    </div>
  );
};

export default File;
