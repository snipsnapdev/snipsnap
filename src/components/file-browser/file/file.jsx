import React from 'react';
import styles from './file.module.scss';

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
      file: {file.name}
      <button className={styles.deleteBtn} onClick={() => onDelete(file.id)}>
        X
      </button>
    </div>
  );
};

export default File;
