import classNames from 'classnames/bind';
import { uniqBy } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

// list of modes https://github.com/ajaxorg/ace-builds/blob/master/ace-modules.d.ts
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-scss';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-less';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-twilight';

import Dropdown from 'components/shared/dropdown';
import { useFiles } from 'contexts/files-provider';
import { findFileById, getFilePath } from 'utils/files-provider-helpers';
import {
  EXTENSION_LANGUAGE_MAPPING,
  DEFAULT_LANGUAGE,
  getLanguageByFilename,
  getLanguageByLabel,
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
      ? getLanguageByLabel(openFile.data.language)
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
        ? getLanguageByLabel(openFile.data.language)
        : getLanguageByFilename(openFile.data.name);
    }

    setLanguage(currentLanguage);
  }, [openFile]);

  const handleLanguageChange = (newLanguage) => {
    if (openFile) {
      filesDispatch({
        type: 'changeOpenFileLanguage',
        newLanguage: newLanguage.label,
      });
    }
    setLanguage(newLanguage);
  };

  const languageItems = uniqBy(LANGUAGES, 'label').map((language) => ({
    text: language.label,
    icon: language.icon,
    onClick: () => handleLanguageChange(language),
  }));

  const handleFileContentChange = (value) =>
    filesDispatch({
      type: 'changeOpenFileContent',
      value,
    });

  const LanguageIcon = language.icon;

  if (!openFile) {
    return (
      <>
        <div className={cx('vertical-line')} />
        <div className={cx('image-wrapper')}>
          <Image
            src="/images/templates-illustration.png"
            alt="Templates"
            width={312}
            height={360}
            quality={90}
          />
        </div>
      </>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('file-path')}>{filePath}</div>
      <div className={cx('editor-container')}>
        <AceEditor
          readOnly={!openFile}
          value={openFile ? openFile.data.content : ''}
          mode={language.aceMode.toLowerCase()}
          theme="twilight"
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
        menuItems={languageItems}
        className={cx('select')}
        position="bottom-right"
        menuClassName={cx('select-menu')}
        stopPropagation
        showIcon
        hasIcons
      >
        <LanguageIcon />
        {language.label}
      </Dropdown>
    </div>
  );
};

export default Editor;
