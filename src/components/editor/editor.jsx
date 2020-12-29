import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';

const LANGUAGES = ['javascript', 'html', 'css', 'json'];

function onChange(newValue) {
  console.log('change', newValue);
}

const Editor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  return (
    <div>
      {/* TODO: replace with select */}
      <div style={{ display: 'flex', width: '800px', justifyContent: 'space-between' }}>
        {LANGUAGES.map((lang, index) => (
          <button
            type="button"
            key={`language-${index}`}
            onClick={() => {
              setLanguage(lang);
            }}
            style={language === lang ? { backgroundColor: 'yellow' } : {}}
          >
            {lang}
          </button>
        ))}
      </div>
      <AceEditor
        mode={language}
        theme="monokai"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
      <button onClick={() => console.log(code)}>Print to console</button>
    </div>
  );
};

export default Editor;
