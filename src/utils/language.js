export const DEFAULT_LANGUAGE = 'Plain Text';

export const EXTENSION_LANGUAGE_MAPPING = {
  text: 'Plain Text',
  py: 'Python',
  java: 'Java',
  json: 'JSON',
  less: 'LESS',
  html: 'HTML',
  yaml: 'YAML',
  css: 'CSS',
  sass: 'SCSS',
  scss: 'SCSS',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
};

export const getLanguageByExtension = (extension) =>
  EXTENSION_LANGUAGE_MAPPING[extension] ?? DEFAULT_LANGUAGE;

export const getLanguageByFilename = (fileName) => {
  const [fileExtension] = fileName.split('.').slice(-1);
  return getLanguageByExtension(fileExtension);
};
