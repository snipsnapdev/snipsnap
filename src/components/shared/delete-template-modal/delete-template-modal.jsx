import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';

import styles from './delete-template-modal.module.scss';

const cx = classNames.bind(styles);

const query = gql`
  mutation deleteTemplateGroup($id: uuid!) {
    delete_templates_by_pk(id: $id) {
      name
      id
    }
  }
`;

const DeleteTemplateModal = (props) => {
  const { id, name, isOpen, onClose } = props;

  const [loading, setLoading] = useState(false);
  const gqlClient = useGqlClient();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await gqlClient.request(query, { id });
      setLoading(false);
      mutate('getOwnedTemplateGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    onClose();
  };

  return (
    <ModalPortal>
      <Modal title={`Delete ${name} template?`} isOpen={isOpen} onRequestClose={onClose}>
        <div className={cx('actions')}>
          <Button themeColor="red" isLoading={loading} onClick={handleDelete}>
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

DeleteTemplateModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

DeleteTemplateModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default DeleteTemplateModal;
