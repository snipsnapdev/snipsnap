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

import styles from './rename-item-modal.module.scss';

const schema = yup.object().shape({
  newName: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Za-z0-9.{}\-_\s]+$/, {
      message: 'Name should have only allowed symbols A-Za-z0-9.{}-_ ',
    }),
});

const cx = classNames.bind(styles);

const RenameItemModal = (props) => {
  const { name, isOpen, onClose, onSave, label } = props;

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
      <Modal theme="grey" title={`Rename ${label}`} isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={`New ${label} name`}
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

RenameItemModal.propTypes = {
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

RenameItemModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default RenameItemModal;
