import React from 'react';
import TreeRecursive from 'components/file-browser/tree-recursive';
import styles from './folder.module.scss';

const Folder = ({ folder, handleDrop, onDelete }) => {
  const folderRef = React.useRef();
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
    <div ref={folderRef} style={{ backgroundColor: isDragOver ? 'blue' : 'transparent' }}>
      <div className={styles.wrapper}>
        folder: {folder.name}
        <button className={styles.deleteBtn} onClick={() => onDelete(folder.id)}>
          X
        </button>
      </div>
      <div className={styles.collapsible}>
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
