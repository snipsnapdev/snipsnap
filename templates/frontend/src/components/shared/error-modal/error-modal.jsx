import classNames from 'classnames/bind';
import { useContext } from 'react';

import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';
import { ErrorModalContext } from 'contexts/error-modal-context';

import styles from './error-modal.module.scss';

const cx = classNames.bind(styles);

const ErrorModal = () => {
  const { errorText, closeErrorModal, isErrorModalOpen } = useContext(ErrorModalContext);

  if (!isErrorModalOpen) {
    return <></>;
  }

  return (
    <ModalPortal>
      <Modal
        title={errorText}
        isOpen={isErrorModalOpen}
        theme="transparent"
        onRequestClose={closeErrorModal}
      >
        <div className={cx('actions')}>
          <Button themeColor="red" onClick={closeErrorModal}>
            Ok
          </Button>
        </div>
      </Modal>
    </ModalPortal>
  );
};

export default ErrorModal;
