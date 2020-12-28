import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(import('react-monaco-editor'), { ssr: false });

const Editor = () => {
  const [code, setCode] = useState('');
  // etc
  return (
    <div>
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
        language="css"
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
    </div>
  );
};

export default Editor;
