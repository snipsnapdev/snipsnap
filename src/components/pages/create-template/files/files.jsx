import classNames from 'classnames/bind';
import { useState } from 'react';

import FileBrowser from 'components/pages/create-template/files/file-browser';
import AddFileModal from 'components/pages/create-template/files/file-browser/add-file-modal';
import AddFolderModal from 'components/pages/create-template/files/file-browser/add-folder-modal';
import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';

import styles from './files.module.scss';

const cx = classNames.bind(styles);

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
      <FileBrowser />
    </>
  );
};

export default Files;
