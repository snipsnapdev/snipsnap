const MAX_FILE_SIZE = 15000; /// 15KB
const MAX_FILES_AMOUNT = 20;

const validatePrompts = (prompts) => {
  if (!Array.isArray(prompts)) return false;

  const variableNames = prompts.map(({ variableName }) => variableName);

  return (
    // Checks if prompts have multiple variableName with the same value or not
    new Set(variableNames).size === prompts.length &&
    // Checks if every prompt has both message and variableName
    prompts.every(({ message, variableName }) => message && variableName)
  );
};

const validateSizesOfFiles = (files) => {
  const callback = ({ type, data }) => {
    if (type === "file") {
      const fileSize = Buffer.byteLength(data.content, "utf8");
      if (fileSize > MAX_FILE_SIZE) {
        throw new Error(
          `File ${data.name} is too large. Max allowed size is ${Math.floor(
            MAX_FILE_SIZE / 1000
          )} KB`
        );
      }
      return fileSize <= MAX_FILE_SIZE;
    } else {
      return data.files.every(callback);
    }
  };

  return files.every(callback);
};

// Ignores folders, counts only files
const validateAmountOfFiles = (files) => {
  let amountOfFiles = 0;

  const callback = ({ type, data }) => {
    if (type === "file") {
      amountOfFiles++;
    } else {
      data.files.forEach(callback);
    }
  };

  files.forEach(callback);

  if (amountOfFiles > MAX_FILES_AMOUNT) {
    throw new Error(
      `Too many files. Please create template with no more than ${MAX_FILES_AMOUNT} files`
    );
  }

  return amountOfFiles <= MAX_FILES_AMOUNT;
};

const validateFiles = (files) => {
  const isFileSizesValid = validateSizesOfFiles(files);
  const amountOfFiles = validateAmountOfFiles(files);
  return isFileSizesValid && amountOfFiles;
};

module.exports = {
  validatePrompts,
  validateSizesOfFiles,
  validateAmountOfFiles,
  validateFiles,
};
