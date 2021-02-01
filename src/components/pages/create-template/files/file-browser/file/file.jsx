import classNames from 'classnames/bind';
import React from 'react';

import CloseSvg from 'icons/close.inline.svg';

import styles from './file.module.scss';

const cx = classNames.bind(styles);

const File = ({ file, onOpen, onDragOver, onDragLeave, onDelete, level }) => {
  const fileRef = React.useRef();

  React.useEffect(() => {
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

  return (
    <div
      ref={fileRef}
      className={styles.wrapper}
      style={{ paddingLeft: 20 + 25 * level }}
      onClick={handleClick}
    >
      <div className={cx('file-icon')} style={{ left: 8 + 25 * level }} />
      {file.data.name}
      <button className={cx('button-delete')} onClick={() => onDelete(file.id)}>
        <CloseSvg className={cx('icon')} />
      </button>
    </div>
  );
};

export default File;
