import classNames from 'classnames/bind';
import AceEditor from 'react-ace';

import { DEFAULT_LANGUAGE } from 'utils/language';

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
import 'ace-builds/src-noconflict/theme-monokai';

import styles from './editor.module.scss';

const cx = classNames.bind(styles);

const Editor = ({
  className,
  readOnly = false,
  content = '',
  language = DEFAULT_LANGUAGE,
  onFileContentChange = () => {},
  theme = 'twilight',
}) => (
  <div className={cx('wrapper', className)}>
    <AceEditor
      readOnly={readOnly}
      value={content}
      mode={language.aceMode.toLowerCase()}
      theme={theme}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="100%"
      fontSize="14px"
      setOptions={{ useWorker: false }}
      style={{ lineHeight: '22px' }}
      showPrintMargin={false}
      onChange={onFileContentChange}
      onLoad={(editor) => {
        editor.renderer.setPadding(22);
        editor.renderer.setScrollMargin(22);
      }}
    />
  </div>
);
export default Editor;
