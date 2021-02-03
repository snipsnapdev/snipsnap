import classNames from 'classnames/bind';
import { useSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, gqlClient } from 'api/graphql';
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
  const [{ token }] = useSession();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await gqlClient(token).request(query, { id });
      setLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    onClose();
  };

  return (
    <ModalPortal>
      <Modal
        title={`Delete ${name} template?`}
        isOpen={isOpen}
        showCloseButton={false}
        onRequestClose={onClose}
      >
        <div className={cx('actions')}>
          <Button className={cx('cancel-button')} theme="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className={cx('delete-button')} loading={loading} onClick={handleDelete}>
            Delete
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
