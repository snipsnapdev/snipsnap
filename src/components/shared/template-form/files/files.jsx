import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';
import FileBrowser from 'components/shared/template-form/files/file-browser';
import AddFileModal from 'components/shared/template-form/files/file-browser/add-file-modal';
import AddFolderModal from 'components/shared/template-form/files/file-browser/add-folder-modal';
import { useFiles } from 'contexts/files-provider';
import { useTemplateGroups } from 'contexts/template-groups-provider';
import { getLanguageByFilename } from 'utils/language';

import styles from './files.module.scss';

const cx = classNames.bind(styles);

const Files = ({ group, onGroupChange }) => {
  const { groups } = useTemplateGroups();
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

  const groupOptions = groups.map((group) => (
    <div key={group.id} onClick={() => onGroupChange(group)}>
      {group.name}
    </div>
  ));

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
        <div className={cx('group-options')}>
          <Dropdown
            menu={groupOptions}
            className={cx('add-options-inner')}
            position="bottom-right"
            stopPropagation
            showIcon
          >
            <span>{group ? group.name : 'select group'}</span>
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

Files.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onGroupChange: PropTypes.func.isRequired,
};

Files.defaultProps = {
  group: null,
};

export default Files;
