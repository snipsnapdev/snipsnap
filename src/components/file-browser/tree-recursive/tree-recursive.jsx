import React from 'react';

import File from 'components/file-browser/file';
import Folder from 'components/file-browser/folder';

import styles from './tree-recursive.module.scss';

const TreeRecursive = ({
  data,
  parentDragOverHandler,
  parentDragLeaveHandler,
  dropHandler,
  parentId,
  onItemDelete,
  level,
}) => (
  <div className={styles.tree}>
    {data.map((item) => {
      if (item.type === 'file') {
        return (
          <File
            key={`browser-${item.data.id}`}
            file={item.data}
            level={level}
            onDragOver={parentDragOverHandler}
            onDragLeave={parentDragLeaveHandler}
            onDrop={(evt) => dropHandler(parentId, evt)}
            onDelete={onItemDelete}
          />
        );
      }
      return (
        <Folder
          key={`browser-${item.data.id}`}
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
