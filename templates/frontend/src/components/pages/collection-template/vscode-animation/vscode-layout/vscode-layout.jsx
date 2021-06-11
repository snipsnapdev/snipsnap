import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import { useReducer, useState, useEffect } from 'react';

import { FilesContext, filesReducer } from 'contexts/files-provider';
import { findFileById } from 'utils/files-provider-helpers';
import { DEFAULT_LANGUAGE, getLanguageByFilename, getLanguageByLabel } from 'utils/language';

import ActivityBottomIcons from './images/activity-bar-bottom.inline.svg';
import ActivityTopIcons from './images/activity-bar-top.inline.svg';
import EmptyEditor from './images/empty-editor.inline.svg';
import FooterLeftIcons from './images/footer-left.inline.svg';
import FooterRightIcons from './images/footer-right.inline.svg';
import ShowcaseLabel from './images/showcase.inline.svg';
import TopLeftIcons from './images/top-left-icons.inline.svg';
import styles from './vscode-layout.module.scss';
import VscodeSidebar from './vscode-sidebar';

const Editor = dynamic(import('components/shared/editor'), { ssr: false });

const cx = classNames.bind(styles);

const getFile = (item) => {
  if (item.type === 'file') {
    return item;
  }
  for (const ch of item.data.files) {
    return getFile(ch);
  }
};

const findFile = (files) => {
  const curLevelFiles = files.filter((item) => item.type === 'file');
  if (curLevelFiles.length > 0) {
    return curLevelFiles[0];
  }
  for (const folder of files) {
    return findFile(folder.data.files);
  }
};

const VscodeLayout = ({ templateName, templateFiles, showFiles, className }) => {
  const [filesState, dispatch] = useReducer(filesReducer, {
    files: templateFiles,
    openFileId: null,
  });

  // update files in the store (will be called if files were not available on initial render)
  useEffect(() => {
    const fileToOpen = findFile(templateFiles);
    dispatch({
      type: 'reset',
      data: {
        files: templateFiles,
        openFileId: fileToOpen ? fileToOpen.id : null,
      },
    });
  }, [templateFiles]);

  const [openFile, setOpenFile] = useState(null);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  // get language for open file to set Ace Editor mode
  useEffect(() => {
    const newOpenFile = findFileById(filesState.files, filesState.openFileId);
    setOpenFile(newOpenFile);

    let currentLanguage = DEFAULT_LANGUAGE;
    if (newOpenFile) {
      currentLanguage = newOpenFile.data.language
        ? getLanguageByLabel(newOpenFile.data.language)
        : getLanguageByFilename(newOpenFile.data.name);
    }

    setLanguage(currentLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesState.openFileId]);

  return (
    <FilesContext.Provider
      value={{
        state: filesState,
        filesDispatch: dispatch,
      }}
    >
      <div className={cx('wrapper', className)}>
        <ShowcaseLabel className={cx('showcase')} />
        <div className={cx('header')}>
          <TopLeftIcons />
          <span className={cx('title')}>{templateName}</span>
        </div>
        <div className={cx('content')}>
          <div className={cx('activity-bar')}>
            <ActivityTopIcons />
            <ActivityBottomIcons />
          </div>
          <VscodeSidebar showFiles={showFiles && filesState.files.length > 0} />
          <div className={cx('editor')}>
            {!(showFiles && filesState.openFileId) && <EmptyEditor />}
            {showFiles && filesState.openFileId && (
              <Editor
                className={cx('editor-content')}
                language={language}
                theme="monokai"
                content={openFile ? openFile.data.content : ''}
                readOnly
              />
            )}
          </div>
        </div>
        <div className={cx('footer')}>
          <FooterLeftIcons />
          <FooterRightIcons />
        </div>
      </div>
    </FilesContext.Provider>
  );
};

export default VscodeLayout;
