import classNames from 'classnames/bind';
import { useEffect, useRef } from 'react';

import { useFiles } from 'contexts/files-provider';
import CloseSvg from 'icons/close.inline.svg';

import styles from './file.module.scss';

const cx = classNames.bind(styles);

const File = ({
  file,
  onOpen,
  onDragOver,
  onDragLeave,
  onDelete,
  onDragStart,
  onDragEnd,
  level,
}) => {
  const fileRef = useRef();

  const {
    state: { openFileId },
  } = useFiles();

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

  return (
    <div
      ref={fileRef}
      className={cx('wrapper', file.id === openFileId && 'wrapper-selected')}
      draggable="true"
      style={{ paddingLeft: 20 + 25 * level }}
      onClick={handleClick}
      onDrag={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={cx('file-icon')} style={{ left: 8 + 25 * level }} />
      {file.data.name}
      <button className={cx('button-delete')} onClick={handleDelete}>
        <CloseSvg className={cx('icon')} />
      </button>
    </div>
  );
};

export default File;
