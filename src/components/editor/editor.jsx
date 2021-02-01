import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';

import { useTemplateStore } from 'stores/template-store';

import styles from './editor.module.scss';

const cx = classNames.bind(styles);

// from https://github.com/securingsincity/react-ace/blob/main/example/index.js
const LANGUAGES = [
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css',
];

const Editor = () => {
  const store = useTemplateStore();
  const [language, setLanguage] = useState('javascript');
  const [isClient, setIsClient] = useState('false');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openFile = store.getOpenFile();
  console.log('Editor', openFile);

  const filePath = store.getOpenFilePath() || 'undefined';

  return (
    <div className={cx('wrapper')}>
      <div className={cx('file-path')}>{filePath}</div>
      <AceEditor
        value={openFile ? openFile.data.content : ''}
        mode={language}
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="100%"
        onChange={(value) => store.setOpenFileContent(value)}
      />
    </div>
  );
};

export default Editor;
