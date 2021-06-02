import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './delete-file-modal.module.scss';

const cx = classNames.bind(styles);

const DeleteFileModal = (props) => {
  const { name, isOpen, onClose, onSave } = props;

  return (
    <ModalPortal>
      <Modal title={`Delete ${name} file?`} isOpen={isOpen} onRequestClose={onClose}>
        <div className={cx('actions')}>
          <Button themeColor="red" onClick={onSave}>
            Delete
          </Button>
          <Button themeType="button-link" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </ModalPortal>
  );
};

DeleteFileModal.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

DeleteFileModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default DeleteFileModal;
