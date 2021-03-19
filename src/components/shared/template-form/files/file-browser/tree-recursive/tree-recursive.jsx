import React from 'react';

import File from 'components/shared/template-form/files/file-browser/file';
import Folder from 'components/shared/template-form/files/file-browser/folder';

import styles from './tree-recursive.module.scss';

const TreeRecursive = ({
  data,
  parentDragOverHandler,
  parentDragLeaveHandler,
  onDropFile,
  parentId,
  onItemDelete,
  onOpenFile,
  onAddFile,
  onAddFolder,
  onRenameFolder,
  onDragStart,
  onDragEnd,
  level,
}) => (
  <div className={styles.tree}>
    {data.map((item) => {
      if (item.type === 'file') {
        return (
          <File
            key={item.id}
            file={item}
            level={level}
            onDragOver={parentDragOverHandler}
            onDragLeave={parentDragLeaveHandler}
            onDrop={(evt) => onDropFile(parentId, evt)}
            onDelete={onItemDelete}
            onOpen={onOpenFile}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      }
      return (
        <Folder
          key={item.id}
          folder={item}
          level={level}
          onDelete={onItemDelete}
          onDropFile={onDropFile}
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
          onOpenFile={onOpenFile}
          onRenameFolder={onRenameFolder}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      );
    })}
  </div>
);

export default TreeRecursive;
