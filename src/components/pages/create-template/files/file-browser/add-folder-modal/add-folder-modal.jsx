import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './add-folder-modal.module.scss';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/[a-zA-Z| |-]+/, { message: "Name should contain only A-Za-z letters, space or '-'" }),
});
const cx = classNames.bind(styles);

const AddFolderModal = (props) => {
  const { isOpen, onClose, onSave } = props;
  const { register, handleSubmit, clearErrors, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = ({ name }) => {
    onSave(name);
    onClose();
  };

  return (
    <ModalPortal>
      <Modal title="Add folder" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Folder name" name="name" register={register} errors={errors.name} />
          <Button className={cx('add-folder-button')} type="submit">
            Add folder
          </Button>
        </form>
      </Modal>
    </ModalPortal>
  );
};

AddFolderModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

AddFolderModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default AddFolderModal;
