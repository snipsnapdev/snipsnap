export const DEFAULT_LANGUAGE = 'Plain_Text';

export const EXTENSION_LANGUAGE_MAPPING = {
  js: 'JavaScript',
  jsx: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript',
  css: 'CSS',
  sass: 'Sass',
  scss: 'Sass',
  less: 'LESS',
  html: 'HTML',
  yaml: 'YAML',
  json: 'JSON',
  py: 'Python',
  java: 'JAVA',
  text: 'Plain_Text',
};

export const getLanguageByExtension = (extension) =>
  EXTENSION_LANGUAGE_MAPPING[extension] ?? DEFAULT_LANGUAGE;

export const getLanguageByFilename = (fileName) => {
  const [fileExtension] = fileName.split('.').slice(-1);
  return getLanguageByExtension(fileExtension);
};
