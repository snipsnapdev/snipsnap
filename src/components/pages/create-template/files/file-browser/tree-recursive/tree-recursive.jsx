import React from 'react';

import File from 'components/pages/create-template/files/file-browser/file';
import Folder from 'components/pages/create-template/files/file-browser/folder';

import styles from './tree-recursive.module.scss';

const TreeRecursive = ({
  data,
  parentDragOverHandler,
  parentDragLeaveHandler,
  dropHandler,
  parentId,
  onItemDelete,
  onOpenFile,
  level,
}) => (
  <div className={styles.tree}>
    {data.map((item) => {
      if (item.type === 'file') {
        return (
          <File
            key={`browser-${item.id}`}
            file={item}
            level={level}
            onDragOver={parentDragOverHandler}
            onDragLeave={parentDragLeaveHandler}
            onDrop={(evt) => dropHandler(parentId, evt)}
            onDelete={onItemDelete}
            onOpen={onOpenFile}
          />
        );
      }
      return (
        <Folder
          key={`browser-${item.id}`}
          folder={item.data}
          handleDrop={dropHandler}
          level={level}
          onDelete={onItemDelete}
        />
      );
    })}
  </div>
);

export default TreeRecursive;
