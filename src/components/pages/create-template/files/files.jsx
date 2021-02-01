import classNames from 'classnames/bind';
import { useState } from 'react';

import FileBrowser from 'components/pages/create-template/files/file-browser';
import AddFileModal from 'components/pages/create-template/files/file-browser/add-file-modal';
import AddFolderModal from 'components/pages/create-template/files/file-browser/add-folder-modal';
import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';

import styles from './files.module.scss';

const cx = classNames.bind(styles);

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

const Files = () => {
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

  const addMenu = (
    <>
      <div onClick={() => setIsAddFileModalOpen(true)}>Add File</div>
      <div onClick={() => setIsAddFolderModalOpen(true)}>Add Folder</div>
    </>
  );

  return (
    <>
      <div className={cx('file-browser-head')}>
        <h2 className={cx('file-browser-title')}>Files</h2>
        <div className={cx('add-options')}>
          <Dropdown
            menu={addMenu}
            className={cx('add-options-inner')}
            position="top-left"
            stopPropagation
          >
            <IconButton icon="plus" className={cx('add-button')} />
          </Dropdown>
        </div>
        {isAddFileModalOpen && (
          <AddFileModal isOpen={isAddFileModalOpen} onClose={() => setIsAddFileModalOpen(false)} />
        )}
        {isAddFolderModalOpen && (
          <AddFolderModal
            isOpen={isAddFolderModalOpen}
            onClose={() => setIsAddFolderModalOpen(false)}
          />
        )}
      </div>
      <FileBrowser files={filesData} />
    </>
  );
};

export default Files;
