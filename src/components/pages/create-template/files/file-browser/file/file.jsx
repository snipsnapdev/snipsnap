import classNames from 'classnames/bind';
import { useEffect, useRef } from 'react';

import CloseSvg from 'icons/close.inline.svg';
import { useTemplateStore } from 'stores/template-store';


import styles from './file.module.scss';

const cx = classNames.bind(styles);

const File = ({ file, onOpen, onDragOver, onDragLeave, onDelete, level }) => {
  const fileRef = useRef();
  const store = useTemplateStore();

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

  const handleClick = () => {
    onOpen(file);
  };

  const handleDelete = () => {
    onDelete(file.id);
  };

  return (
    <div
      ref={fileRef}
      className={cx('wrapper', file.id === store.getOpenFile().id && 'wrapper-selected')}
      style={{ paddingLeft: 20 + 25 * level }}
      onClick={handleClick}
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
