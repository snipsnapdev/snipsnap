import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
// import 'ace-builds/src-noconflict/theme-monokai';
import styles from './editor.module.scss';

const cx = classNames.bind(styles);

const LANGUAGES = ['javascript', 'html', 'css', 'json'];

function onChange(newValue) {
  console.log('change', newValue);
}

const Editor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isClient, setIsClient] = useState('false');
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('file-path')}>bullets/hello.js</div>
      <AceEditor
        mode={language}
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="100%"
        onChange={onChange}
      />
      {/* <div>
        <button onClick={() => console.log(code)}>Print to console</button>
      </div> */}
      {/* <div style={{ display: 'flex', width: '800px', justifyContent: 'space-between' }}>
        {LANGUAGES.map((lang, index) => (
          <button
            type="button"
            key={`language-${index}`}
            style={language === lang ? { backgroundColor: 'yellow' } : {}}
            onClick={() => {
              setLanguage(lang);
            }}
          >
            {lang}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default Editor;
