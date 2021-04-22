import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
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
    .matches(/[a-zA-Z| |-]+/, { message: "Name should contain only A-Za-z letters, space or '-'" }),
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
  const { register, handleSubmit, clearErrors, errors } = useForm({
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

    clearErrors();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <Modal title="Add group" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" name="name" register={register} errors={errors.name} />
          <Button className={cx('button')} type="submit" loading={loading}>
            Add group
          </Button>
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