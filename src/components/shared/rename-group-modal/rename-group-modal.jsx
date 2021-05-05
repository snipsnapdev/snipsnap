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

import styles from './rename-group-modal.module.scss';

const schema = yup.object().shape({
  newName: yup
    .string()
    .required('Name is required')
    .matches(/^[a-zA-Z]+(-[a-zA-Z]+)*$/, {
      message: "Name should contain only A-Za-z letters, space or '-'",
    }),
});

const cx = classNames.bind(styles);

const query = gql`
  mutation renameTemplateGroup($id: uuid!, $newName: String!) {
    update_template_groups_by_pk(_set: { name: $newName }, pk_columns: { id: $id }) {
      name
      owner_id
      id
    }
  }
`;

const RenameGroupModal = (props) => {
  const { id, name, isOpen, onClose } = props;

  const { register, handleSubmit, clearErrors, errors } = useForm({
    defaultValues: { newName: name },
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const gqlClient = useGqlClient();
  const onSubmit = async ({ newName }) => {
    try {
      setLoading(true);
      await gqlClient.request(query, { id, newName });
      setLoading(false);
      mutate('getOwnedTemplateGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal title="Rename group" isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="New group name"
            name="newName"
            register={register}
            error={errors.name?.message}
          />
          <div className={cx('actions')}>
            <Button className={cx('rename-group-button')} type="submit" loading={loading}>
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

RenameGroupModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

RenameGroupModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default RenameGroupModal;
