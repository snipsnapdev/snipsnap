import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './create-template-group-modal.module.scss';

const cx = classNames.bind(styles);

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[A-Za-z0-9.{}\-_\s]+$/, {
      message: 'Name should have only allowed symbols A-Za-z0-9.{}-_ ',
    }),
});

const query = gql`
  mutation createTemplatesGroup($name: String!) {
    insert_template_groups_one(object: { name: $name }) {
      name
      owner_id
      id
    }
  }
`;

const CreateTemplateGroupModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const gqlClient = useGqlClient();

  const onSubmit = async ({ name }) => {
    try {
      setLoading(true);
      await gqlClient.request(query, { name });
      setLoading(false);
      onClose();
      mutate('getOwnedTemplateGroups');
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && isOpen) {
      register(inputRef.current);
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal theme="grey" title="Add group" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" name="name" error={errors.name?.message} ref={inputRef} />
          <div className={cx('actions')}>
            <Button type="submit" isLoading={loading}>
              Add group
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

CreateTemplateGroupModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

CreateTemplateGroupModal.defaultProps = {
  isOpen: false,
};

export default CreateTemplateGroupModal;
