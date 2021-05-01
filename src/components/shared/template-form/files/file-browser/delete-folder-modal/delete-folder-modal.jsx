import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './delete-folder-modal.module.scss';

const cx = classNames.bind(styles);

const DeleteFolderModal = (props) => {
  const { name, isOpen, onClose, onSave } = props;

  return (
    <ModalPortal>
      <Modal title={`Delete ${name} folder?`} isOpen={isOpen} onRequestClose={onClose}>
        <div className={cx('actions')}>
          <Button className={cx('cancel-button')} theme="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className={cx('delete-button')} onClick={onSave}>
            Delete
          </Button>
        </div>
      </Modal>
    </ModalPortal>
  );
};

DeleteFolderModal.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

DeleteFolderModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default DeleteFolderModal;
