import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';
import FileBrowser from 'components/shared/template-form/files/file-browser';
import AddFileModal from 'components/shared/template-form/files/file-browser/add-file-modal';
import AddFolderModal from 'components/shared/template-form/files/file-browser/add-folder-modal';
import { useFiles } from 'contexts/files-provider';
import { getLanguageByFilename } from 'utils/language';

import styles from './files.module.scss';

const cx = classNames.bind(styles);

const Files = () => {
  const { filesDispatch } = useFiles();

  const addFileHandler = (fileName) => {
    filesDispatch({
      type: 'addItem',
      data: {
        name: fileName,
        language: getLanguageByFilename(fileName),
        content: '',
      },
    });
  };

  const addFolderHandler = (folderName) => {
    filesDispatch({
      type: 'addItem',
      data: {
        name: folderName,
        files: [],
      },
    });
  };

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
            <IconButton className={cx('add-button')} size="sm" icon="plus" iconSize={8} />
          </Dropdown>
        </div>
        {isAddFileModalOpen && (
          <AddFileModal
            isOpen={isAddFileModalOpen}
            onClose={() => setIsAddFileModalOpen(false)}
            onSave={addFileHandler}
          />
        )}
        {isAddFolderModalOpen && (
          <AddFolderModal
            isOpen={isAddFolderModalOpen}
            onClose={() => setIsAddFolderModalOpen(false)}
            onSave={addFolderHandler}
          />
        )}
      </div>

      <FileBrowser />
    </>
  );
};

export default Files;