import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './rename-folder-modal.module.scss';

const schema = yup.object().shape({
  newName: yup
    .string()
    .required('Name is required')
    .matches(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
      message: "Name should contain only A-Za-z letters, space or '-'",
    }),
});

const cx = classNames.bind(styles);

const RenameFolderModal = (props) => {
  const { name, isOpen, onClose, onSave } = props;

  const { register, handleSubmit, clearErrors, errors } = useForm({
    defaultValues: { newName: name },
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ newName }) => {
    onSave(newName);
    onClose();
  };

  return (
    <ModalPortal>
      <Modal title="Rename folder" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="New folder name"
            name="newName"
            register={register}
            error={errors.newName?.message}
          />
          <div className={cx('actions')}>
            <Button type="submit" isLoading={loading}>
              Save
            </Button>
            <Button themeType="button-link" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </ModalPortal>
  );
};

RenameFolderModal.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

RenameFolderModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default RenameFolderModal;
