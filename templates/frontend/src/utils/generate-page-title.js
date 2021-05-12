const generatePageTitle = (pageName) => {
  const baseTitle = 'Snipsnap: Templates';
  const separator = '–';
  return pageName ? `${baseTitle} ${separator} ${pageName}` : baseTitle;
};

export default generatePageTitle;
