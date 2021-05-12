import PlainTextIcon from 'icons/file-types/default_file.inline.svg';
import CssIcon from 'icons/file-types/file_type_css.inline.svg';
import HtmlIcon from 'icons/file-types/file_type_html.inline.svg';
import JavaIcon from 'icons/file-types/file_type_java.inline.svg';
import JavascriptIcon from 'icons/file-types/file_type_js.inline.svg';
import JsonIcon from 'icons/file-types/file_type_json.inline.svg';
import LessIcon from 'icons/file-types/file_type_less.inline.svg';
import PythonIcon from 'icons/file-types/file_type_python.inline.svg';
import ReactIcon from 'icons/file-types/file_type_reactjs.inline.svg';
import SassIcon from 'icons/file-types/file_type_sass.inline.svg';
import TypescriptIcon from 'icons/file-types/file_type_typescript.inline.svg';
import YamlIcon from 'icons/file-types/file_type_yaml.inline.svg';

export const DEFAULT_LANGUAGE = {
  label: 'Plain_Text',
  icon: PlainTextIcon,
};

export const EXTENSION_LANGUAGE_MAPPING = {
  text: {
    label: 'Plain_Text',
    icon: PlainTextIcon,
  },
  py: {
    label: 'Python',
    icon: PythonIcon,
  },
  java: {
    label: 'Java',
    icon: JavaIcon,
  },
  json: {
    label: 'JSON',
    icon: JsonIcon,
  },
  less: {
    label: 'LESS',
    icon: LessIcon,
  },
  html: {
    label: 'HTML',
    icon: HtmlIcon,
  },
  yaml: {
    label: 'YAML',
    icon: YamlIcon,
  },
  css: {
    label: 'CSS',
    icon: CssIcon,
  },
  sass: {
    label: 'SCSS',
    icon: SassIcon,
  },
  scss: {
    label: 'SCSS',
    icon: SassIcon,
  },
  ts: {
    label: 'Typescript',
    icon: TypescriptIcon,
  },
  tsx: {
    label: 'Typescript',
    icon: TypescriptIcon,
  },
  js: {
    label: 'Javascript',
    icon: JavascriptIcon,
  },
  jsx: {
    label: 'Javascript',
    icon: ReactIcon,
  },
};

export const getLanguageByExtension = (extension) =>
  EXTENSION_LANGUAGE_MAPPING[extension] ?? DEFAULT_LANGUAGE;

export const getLanguageByFilename = (fileName) => {
  const [fileExtension] = fileName.split('.').slice(-1);
  return getLanguageByExtension(fileExtension);
};

export const getIconByFilename = (fileName) => {
  const [fileExtension] = fileName.split('.').slice(-1);
  return getLanguageByExtension(fileExtension).icon;
};

export const getLanguageByLabel = (label) => {
  const found = Object.values(EXTENSION_LANGUAGE_MAPPING).find((item) => item.label === label);
  const res = found || DEFAULT_LANGUAGE;
  console.log('search', label, 'found', found, res);
  return res;
};
