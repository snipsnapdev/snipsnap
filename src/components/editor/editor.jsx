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
import 'ace-builds/src-noconflict/theme-monokai';

import Dropdown from 'components/shared/dropdown';
import { useTemplateStore } from 'stores/template-store';

import styles from './editor.module.scss';
import LANGUAGE_MAPPING from './extension-language-mapping';

const cx = classNames.bind(styles);

const DEFAULT_LANGUAGE = 'JavaScript';

const Editor = () => {
  const LANGUAGES = Object.values(LANGUAGE_MAPPING);
  const store = useTemplateStore();

  const openFile = store.getOpenFile();

  const filePath = store.getOpenFilePath() || 'undefined';

  const currentFileName = openFile ? openFile.data.name.split('.') : null;
  const currentExtension = openFile ? currentFileName[currentFileName.length - 1] : null;
  const currentLanguage = LANGUAGE_MAPPING[currentExtension] ?? DEFAULT_LANGUAGE;

  const [language, setLanguage] = useState(currentLanguage);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const currentFileName = openFile ? openFile.data.name.split('.') : null;
    const currentExtension = openFile ? currentFileName[currentFileName.length - 1] : null;
    const currentLanguage = LANGUAGE_MAPPING[currentExtension] ?? DEFAULT_LANGUAGE;

    setLanguage(currentLanguage);
  }, [openFile]);

  const languageOptions = (
    <>
      {LANGUAGES.map((item, i) => (
        <div key={`${item}-${i}`} onClick={() => setLanguage(item)}>
          {item}
        </div>
      ))}
    </>
  );

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
          onChange={(value) => store.setOpenFileContent(value)}
          onLoad={(editor) => {
            editor.renderer.setPadding(22);
            editor.renderer.setScrollMargin(22);
          }}
        />
      </div>
      <div className={cx('select')}>
        <Dropdown
          menu={languageOptions}
          className={cx('select-inner')}
          position="bottom-right"
          menuClassName={cx('select-options')}
          stopPropagation
        >
          <div className={cx('select-current')}>{language}</div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Editor;
