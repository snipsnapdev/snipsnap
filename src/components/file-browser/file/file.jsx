import React from 'react';
import classNames from 'classnames/bind';
import DeleteIcon from '../icons/cross.svg';
import styles from './file.module.scss';

const cx = classNames.bind(styles);

const File = ({ file, onDragOver, onDragLeave, onDelete }) => {
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

  return (
    <div ref={fileRef} className={styles.wrapper}>
      {file.name}
      <button className={cx('button-delete')} onClick={() => onDelete(file.id)}>
        <DeleteIcon className={cx('icon')} />
      </button>
    </div>
  );
};

export default File;
