import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './add-file-modal.module.scss';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Za-z0-9.{}\-_\s\[\]]+$/, {
      message: 'Name is not valid',
    }),
});
const cx = classNames.bind(styles);

const AddFileModal = (props) => {
  const { isOpen, onClose, onSave } = props;
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = ({ name }) => {
    onSave(name);
    onClose();
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      register(inputRef.current);
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalPortal>
      <Modal theme="grey" title="Add file" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="File name" name="name" ref={inputRef} error={errors.name?.message} />
          <div className={cx('actions')}>
            <Button type="submit">Add file</Button>
            <Button themeType="button-link" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </ModalPortal>
  );
};

AddFileModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

AddFileModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSave: () => {},
};

export default AddFileModal;
