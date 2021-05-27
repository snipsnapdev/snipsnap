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

import styles from './rename-group-modal.module.scss';

const schema = yup.object().shape({
  newName: yup.string().required('Name is required'),
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

  const { register, handleSubmit, errors } = useForm({
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
      throw new Error(`Renaming group failed: ${err}`);
    }

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

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal title="Rename group" isOpen={isOpen} theme="grey" onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="New group name"
            name="newName"
            error={errors.newName?.message}
            ref={inputRef}
          />
          <div className={cx('actions')}>
            <Button className={cx('rename-group-button')} type="submit" isLoading={loading}>
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
