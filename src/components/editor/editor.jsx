import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false });

const LANGUAGES = ['typescript', 'javascript', 'html', 'css', 'python'];

const Editor = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');

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
      <MonacoEditor
        editorDidMount={() => {
          window.MonacoEnvironment.getWorkerUrl = (_moduleId, label) => {
            if (label === 'json') return '_next/static/json.worker.js';
            if (label === 'css') return '_next/static/css.worker.js';
            if (label === 'html') return '_next/static/html.worker.js';
            if (label === 'typescript' || label === 'javascript')
              return '_next/static/ts.worker.js';
            return '_next/static/editor.worker.js';
          };
        }}
        language={language}
        width="800"
        height="600"
        theme="vs-dark"
        value={code}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={setCode}
      />
      <button onClick={() => console.log(code)}>Print to console</button>
    </div>
  );
};

export default Editor;
