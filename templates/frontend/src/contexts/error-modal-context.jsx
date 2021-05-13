import React, { useCallback, useState } from 'react';

import ErrorModal from 'components/shared/error-modal';

const ErrorModalContext = React.createContext({
  isErrorModalOpen: false,
  errorText: '',
  showErrorModal: () => {},
  hideErrorModal: () => {},
});

const ErrorModalProvider = ({ children }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');

  const showErrorModal = (text) => {
    console.log('show err');
    setErrorText(text);
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    console.log('hide err');
    setIsErrorModalOpen(false);
    setErrorText('');
  };

  const contextValue = {
    isErrorModalOpen,
    errorText,
    showErrorModal: useCallback((text) => showErrorModal(text), []),
    closeErrorModal: useCallback(() => closeErrorModal(), []),
  };

  return (
    <ErrorModalContext.Provider value={contextValue}>
      {isErrorModalOpen && <ErrorModal />}
      {children}
    </ErrorModalContext.Provider>
  );
};

export { ErrorModalContext, ErrorModalProvider };
