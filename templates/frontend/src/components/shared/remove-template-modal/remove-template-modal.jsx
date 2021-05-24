import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';
import useSession from 'hooks/use-session';

import styles from './remove-template-modal.module.scss';

const cx = classNames.bind(styles);

const unshareTemplateQuery = gql`
  mutation shareTemplate($templateId: String!, $shareToUserEmail: String!) {
    unshare_template_from_me(
      object: { template_id: $templateId, share_to_user_email: $shareToUserEmail }
    ) {
      shared_to_user_id
    }
  }
`;

const RemoveTemplateModal = (props) => {
  const { id, name, isOpen, onClose } = props;

  const [session] = useSession();
  const {
    user: { id: userId, email },
  } = session;

  const [loading, setLoading] = useState(false);
  const gqlClient = useGqlClient();

  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      console.log('remove', id, 'from', email);
      await gqlClient.request(unshareTemplateQuery, {
        templateId: id,
        shareToUserEmail: email,
      });
      setLoading(false);
      mutate('getOwnedTemplateGroups');

      // if deleted template was open, redirect to home page
      if (router.asPath === `/template/${id}`) {
        router.push('/');
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    onClose();
  };

  return (
    <ModalPortal>
      <Modal
        title={`Remove ${name} template?`}
        isOpen={isOpen}
        theme="transparent"
        onRequestClose={onClose}
      >
        <div className={cx('actions')}>
          <Button themeColor="red" isLoading={loading} onClick={handleDelete}>
            Remove
          </Button>
          <Button themeType="button-link" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </ModalPortal>
  );
};

RemoveTemplateModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

RemoveTemplateModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default RemoveTemplateModal;
