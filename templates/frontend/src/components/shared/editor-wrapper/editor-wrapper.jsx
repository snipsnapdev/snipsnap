import classNames from 'classnames/bind';
import { uniqBy } from 'lodash';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import { useFiles } from 'contexts/files-provider';
import { findFileById, getFilePath } from 'utils/files-provider-helpers';
import {
  EXTENSION_LANGUAGE_MAPPING,
  DEFAULT_LANGUAGE,
  getLanguageByFilename,
  getLanguageByLabel,
} from 'utils/language';

import styles from './editor-wrapper.module.scss';

const Editor = dynamic(import('components/shared/editor'), { ssr: false });

const cx = classNames.bind(styles);

const EditorWrapper = ({ readOnly = false }) => {
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
            width={348}
            height={400}
            quality={90}
          />
        </div>
      </>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('file-path')}>{filePath}</div>
      <Editor
        language={language ?? DEFAULT_LANGUAGE}
        content={openFile ? openFile.data.content : ''}
        readOnly={!openFile || readOnly}
        className={cx('editor-container')}
        onFileContentChange={handleFileContentChange}
      />
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

export default EditorWrapper;
