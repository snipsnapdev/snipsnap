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
  label: 'Plain Text',
  aceMode: 'Plain_Text',
  icon: PlainTextIcon,
};

// extension, ace mode name, dropdown label, icon

export const EXTENSION_LANGUAGE_MAPPING = {
  text: {
    aceMode: 'Plain_Text',
    label: 'Plain Text',
    icon: PlainTextIcon,
  },
  py: {
    label: 'Python',
    aceMode: 'Python',
    icon: PythonIcon,
  },
  java: {
    aceMode: 'Java',
    label: 'Java',
    icon: JavaIcon,
  },
  json: {
    aceMode: 'JSON',
    label: 'JSON',
    icon: JsonIcon,
  },
  less: {
    aceMode: 'LESS',
    label: 'Less',
    icon: LessIcon,
  },
  html: {
    aceMode: 'HTML',
    label: 'HTML',
    icon: HtmlIcon,
  },
  yaml: {
    aceMode: 'YAML',
    label: 'YAML',
    icon: YamlIcon,
  },
  css: {
    aceMode: 'CSS',
    label: 'CSS',
    icon: CssIcon,
  },
  sass: {
    aceMode: 'SCSS',
    label: 'Sass',
    icon: SassIcon,
  },
  scss: {
    aceMode: 'SCSS',
    label: 'Sass',
    icon: SassIcon,
  },
  ts: {
    aceMode: 'Typescript',
    label: 'Typescript',
    icon: TypescriptIcon,
  },
  tsx: {
    label: 'Typescript',
    icon: TypescriptIcon,
  },
  js: {
    aceMode: 'Javascript',
    label: 'Javascript',
    icon: JavascriptIcon,
  },
  jsx: {
    aceMode: 'Javascript',
    label: 'ReactJS',
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
  return res;
};
