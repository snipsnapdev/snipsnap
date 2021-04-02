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
import { useTemplateGroups } from 'contexts/template-groups-provider';
import useSession from 'hooks/use-session';

import styles from './share-modal.module.scss';

const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
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

const getUsersByEmailQuery = gql`
  query MyQuery($email: String!) {
    users(where: { email: { _eq: $email } }) {
      name
      user_id
      email
    }
  }
`;

const shareTemplateGroupQuery = gql`
  mutation shareTemplateGroup($groupId: uuid!, $userTo: uuid!, $userBy: uuid!) {
    insert_shared_template_groups_one(
      object: {
        template_group_id: $groupId
        shared_to_user_id: $userTo
        shared_by_user_id: $userBy
      }
    ) {
      id
    }
  }
`;

const ShareModal = (props) => {
  const { id, type, isOpen, onClose } = props;

  const { groups, templates } = useTemplateGroups();

  let sharedItem = null;

  if (type === 'group') {
    sharedItem = groups.find((group) => group.id === id);
  } else {
    sharedItem = templates.find((group) => group.id === id);
    groups.forEach((group) => {
      if (group.templates.find((template) => template.id === id)) {
        sharedItem = group.templates.find((template) => template.id === id);
      }
    });
  }

  const { register, handleSubmit, clearErrors, errors } = useForm({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const [session] = useSession();
  const {
    user: { id: currentUserId },
  } = session;

  const [loading, setLoading] = useState(false);

  const gqlClient = useGqlClient();
  const onSubmit = async ({ email }) => {
    try {
      setLoading(true);

      // get user id by email
      const { users } = await gqlClient.request(getUsersByEmailQuery, { email });
      const userShareTo = users[0];

      if (type === 'group') {
        // share template group with user
        await gqlClient.request(shareTemplateGroupQuery, {
          groupId: id,
          userTo: userShareTo.user_id,
          userBy: currentUserId,
        });

        // share all templates within the group with user
      }

      setLoading(false);
      mutate('getOwnedTemplateGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    // onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal title={`Share ${sharedItem.name} ${type}`} isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cx('top')}>
            <Input
              placeholder="Invite someone..."
              name="email"
              register={register}
              errors={errors.email}
            />
            <Button className={cx('send-button')} type="submit" loading={loading}>
              Send invite
            </Button>
          </div>
        </form>
      </Modal>
    </ModalPortal>
  );
};

ShareModal.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['template', 'group']).isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

ShareModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default ShareModal;
