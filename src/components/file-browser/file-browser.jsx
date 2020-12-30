import React from 'react';
import { cloneDeep } from 'lodash';
import useForceRender from 'hooks/use-force-render';
import styles from './file-browser.module.scss';

const filesData = [
  {
    type: 'folder',
    data: {
      name: 'yaml',
      files: [
        {
          type: 'file',
          data: {
            name: 'yaml.js',
            language: 'javascript',
            content: '// TODO',
          },
        },
        {
          type: 'file',
          data: {
            name: 'api.jx',
            language: 'javascript',
            content: '// TODO',
          },
        },
      ],
    },
  },
  {
    type: 'file',
    data: {
      name: 'index0.js',
      language: 'javascript',
      content: '// TODO',
    },
  },
  {
    type: 'folder',
    data: {
      name: 'component1',
      files: [
        {
          type: 'folder',
          data: {
            name: 'yaml',
            files: [
              {
                type: 'file',
                data: {
                  name: 'yaml.js',
                  language: 'javascript',
                  content: '// TODO',
                },
              },
              {
                type: 'file',
                data: {
                  name: 'api.jx',
                  language: 'javascript',
                  content: '// TODO',
                },
              },
            ],
          },
        },
        {
          type: 'file',
          data: {
            name: 'component1.module.css',
            language: 'css',
            content: '.container {width: 100%;}',
          },
        },
        {
          type: 'file',
          data: {
            name: 'component1.jsx',
            language: 'javascript',
            content: '// TODO',
          },
        },
        {
          type: 'file',
          data: {
            name: 'index1.js',
            language: 'javascript',
            content: '// TODO',
          },
        },
        {
          type: 'folder',
          data: {
            name: 'component11',
            files: [
              {
                type: 'file',
                data: {
                  name: 'index11.js',
                  language: 'javascript',
                  content: '// TODO',
                },
              },
              {
                type: 'file',
                data: {
                  name: 'component11.module.css',
                  language: 'css',
                  content: '.container {width: 100%;}',
                },
              },
              {
                type: 'file',
                data: {
                  name: 'component11.jsx',
                  language: 'javascript',
                  content: '// TODO',
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    type: 'folder',
    data: {
      name: 'component2',
      files: [
        {
          type: 'file',
          data: {
            name: 'index2.js',
            language: 'javascript',
            content: '// TODO',
          },
        },
        {
          type: 'file',
          data: {
            name: 'component2.module.css',
            language: 'css',
            content: '.container {width: 100%;}',
          },
        },
        {
          type: 'file',
          data: {
            name: 'component.jsx',
            language: 'javascript',
            content: '// TODO',
          },
        },
      ],
    },
  },
];

const File = ({ file, onDragOver, onDragLeave }) => {
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

  return <div ref={fileRef}>file: {file.name}</div>;
};

const Folder = ({ folder, handleDrop }) => {
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
      <div>folder: {folder.name}</div>
      <div className={styles.collapsible}>
        {/* Call the <TreeRecursive /> component with the current item.childrens */}
        {folder.files && folder.files.length > 0 && (
          <TreeRecursive
            data={folder.files}
            parentDragOverHandler={handleDragOver}
            parentDragLeaveHandler={handleDragLeave}
            dropHandler={handleDrop}
            parentId={folder.id}
          />
        )}
      </div>
    </div>
  );
};

const TreeRecursive = ({
  data,
  parentDragOverHandler,
  parentDragLeaveHandler,
  dropHandler,
  parentId,
}) => (
  <>
    {data.map((item) => {
      if (item.type === 'file') {
        return (
          <File
            file={item.data}
            onDragOver={parentDragOverHandler}
            onDragLeave={parentDragLeaveHandler}
            onDrop={(evt) => dropHandler(parentId, evt)}
          />
        );
      }
      return <Folder folder={item.data} handleDrop={dropHandler} />;
    })}
  </>
);

let id = 1;
const addIdsToFiles = (file) => ({
  type: file.type,
  data: {
    ...file.data,
    id: id++,
    ...(file.data.files ? { files: file.data.files.map((ch) => addIdsToFiles(ch)) } : {}),
  },
});

// folders first
const fileComparator = (file1, file2) => {
  if (file1.type === 'file' && file2.type === 'folder') {
    return 1;
  }
  if (file1.type === 'folder' && file2.type === 'file') {
    return -1;
  }
  if (file1.data.name > file2.data.name) {
    return 1;
  }
  return -1;
};

const sortFiles = (files) => {
  files.sort(fileComparator);
  files.filter((item) => item.type === 'folder').forEach((item) => sortFiles(item.data.files));
};

// Handle add file
const findFolderPathByKey = (data, folderId, path = []) => {
  for (const item of data) {
    if (item.data.id === folderId) {
      return [...path, item];
    }
    if (item.data.files) {
      const result = findFolderPathByKey(item.data.files, folderId, [...path, item]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const FileBrowser = () => {
  const dataRef = React.useRef([]);

  const forceRender = useForceRender();
  const setData = (newData) => {
    dataRef.current = newData;
    forceRender();
  };

  React.useEffect(() => {
    const filesWithIds = filesData.map(addIdsToFiles);
    sortFiles(filesWithIds);
    setData(filesWithIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteFile = (fileId) => {
    // TODO: find parent by id and delete
  };

  const treeRef = React.useRef();
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

  const handleFileDrop = (evt) => {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s) - might contain directories, but doesn't work in IE and Safari
      for (let i = 0; i < evt.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (evt.dataTransfer.items[i].kind === 'file') {
          const file = evt.dataTransfer.items[i].getAsFile();
          console.log(`... file[${i}].name = ${file.name}`);

          return new Promise((resolve) => {
            const reader = new window.FileReader();
            reader.onload = () => {
              const fileContent = reader.result;
              const newFile = {
                type: 'file',
                data: {
                  name: file.name,
                  content: fileContent,
                },
              };
              resolve(newFile);
            };
            reader.readAsText(file);
          });
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
        console.log(`... file[${i}].name = ${evt.dataTransfer.files[i].name}`);

        const file = evt.dataTransfer.files[i];
        return new Promise((resolve) => {
          const reader = new window.FileReader();
          reader.onload = () => {
            const fileContent = reader.result;
            const newFile = {
              type: 'file',
              data: {
                name: file.name,
                content: fileContent,
              },
            };
            resolve(newFile);
          };
          reader.readAsText(file);
        });
      }
    }
  };

  const handleAddFile = async (folderId, evt) => {
    const data = dataRef.current;

    const newFile = await handleFileDrop(evt);

    if (newFile) {
      // no parent folder - add to root
      if (!folderId) {
        const newData = [...data, newFile];
        sortFiles(newData);
        setData(newData);
      } else {
        const newData = cloneDeep(data);
        const folderPath = findFolderPathByKey(newData, folderId);
        const lastFolder = folderPath[folderPath.length - 1];
        lastFolder.data.files.push(newFile);
        sortFiles(lastFolder.data.files);
        setData(newData);
      }
    }
  };

  React.useEffect(() => {
    const treeElem = treeRef.current;

    const dropHandler = (evt) => {
      handleAddFile(null, evt);
      setIsDragOver(false);
    };

    treeElem.addEventListener('dragover', handleDragOver);
    treeElem.addEventListener('dragleave', handleDragLeave);
    treeElem.addEventListener('dragexit', handleDragLeave);
    treeElem.addEventListener('drop', dropHandler);

    return () => {
      treeElem.removeEventListener('dragover', handleDragOver);
      treeElem.removeEventListener('dragleave', handleDragLeave);
      treeElem.removeEventListener('dragexit', handleDragLeave);
      treeElem.removeEventListener('drop', dropHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDragOver, handleDragLeave]);

  return (
    <div
      className={styles.tree}
      ref={treeRef}
      style={{ backgroundColor: isDragOver ? 'blue' : 'transparent' }}
    >
      <TreeRecursive
        data={dataRef.current}
        parentDragOverHandler={handleDragOver}
        parentDragLeaveHandler={handleDragLeave}
        dropHandler={handleAddFile}
        parentId={null}
      />
    </div>
  );
};

export default FileBrowser;
