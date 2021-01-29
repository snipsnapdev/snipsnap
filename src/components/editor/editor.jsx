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
            style={language === lang ? { backgroundColor: 'yellow' } : {}}
            onClick={() => {
              setLanguage(lang);
            }}
          >
            {lang}
          </button>
        ))}
      </div>
      <AceEditor
        mode={language}
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        onChange={onChange}
      />
      <button onClick={() => console.log(code)}>Print to console</button>
    </div>
  );
};

export default Editor;
