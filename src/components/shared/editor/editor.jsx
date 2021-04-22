import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-sass';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-less';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';

import Dropdown from 'components/shared/dropdown';
import { useFiles } from 'contexts/files-provider';
import { findFileById, getFilePath } from 'utils/files-provider-helpers';
import {
  EXTENSION_LANGUAGE_MAPPING,
  DEFAULT_LANGUAGE,
  getLanguageByFilename,
} from 'utils/language';

import styles from './editor.module.scss';

const cx = classNames.bind(styles);

const Editor = () => {
  const LANGUAGES = Object.values(EXTENSION_LANGUAGE_MAPPING);

  const {
    state: { files, openFileId },
    filesDispatch,
  } = useFiles();
  const openFile = findFileById(files, openFileId);
  const filePath = getFilePath(files, openFileId);

  let currentLanguage = DEFAULT_LANGUAGE;
  if (openFile) {
    currentLanguage = openFile.data.language
      ? openFile.data.language
      : getLanguageByFilename(openFile.data.name);
  }

  const [language, setLanguage] = useState(currentLanguage);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let currentLanguage = DEFAULT_LANGUAGE;
    if (openFile) {
      currentLanguage = openFile.data.language
        ? openFile.data.language
        : getLanguageByFilename(openFile.data.name);
    }

    setLanguage(currentLanguage);
  }, [openFile]);

  const handleLanguageChange = (newLanguage) => {
    if (openFile) {
      filesDispatch({
        type: 'changeOpenFileLanguage',
        newLanguage,
      });
    }
    setLanguage(newLanguage);
  };

  const languageOptions = (
    <>
      {LANGUAGES.map((item, i) => (
        <div key={`${item}-${i}`} onClick={() => handleLanguageChange(item)}>
          {item}
        </div>
      ))}
    </>
  );

  const handleFileContentChange = (value) =>
    filesDispatch({
      type: 'changeOpenFileContent',
      value,
    });

  return (
    <div className={cx('wrapper')}>
      <div className={cx('file-path')}>{filePath}</div>
      <div className={cx('editor-container')}>
        <AceEditor
          value={openFile ? openFile.data.content : ''}
          mode={language.toLowerCase()}
          theme="monokai"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="100%"
          fontSize="14px"
          style={{ lineHeight: '22px' }}
          showPrintMargin={false}
          onChange={handleFileContentChange}
          onLoad={(editor) => {
            editor.renderer.setPadding(22);
            editor.renderer.setScrollMargin(22);
          }}
        />
      </div>
      <Dropdown
        menu={languageOptions}
        className={cx('select')}
        position="bottom-right"
        menuClassName={cx('select-menu')}
        stopPropagation
        showIcon
      >
        {language}
      </Dropdown>
    </div>
  );
};

export default Editor;
