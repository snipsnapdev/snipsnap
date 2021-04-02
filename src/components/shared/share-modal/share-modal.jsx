import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
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

const getUsersTemplateGroupSharedTo = gql`
  query MyQuery($groupId: uuid!) {
    shared_template_groups(where: { template_group_id: { _eq: $groupId } }) {
      shared_to_user_id
    }
  }
`;

const getUsersTemplateSharedTo = gql`
  query MyQuery($templateId: uuid!) {
    shared_templates(where: { template_id: { _eq: $templateId } }) {
      shared_to_user_id
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

const getUsersByIdsQuery = gql`
  query MyQuery($ids: [uuid!]!) {
    users(where: { user_id: { _in: $ids } }) {
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

const shareTemplateQuery = gql`
  mutation shareTemplate($templateId: uuid!, $userTo: uuid!, $userBy: uuid!) {
    insert_shared_templates_one(
      object: { template_id: $templateId, shared_to_user_id: $userTo, shared_by_user_id: $userBy }
    ) {
      id
    }
  }
`;

const ShareModal = (props) => {
  const { id, type, isOpen, onClose } = props;

  const [session] = useSession();
  const {
    user: { id: currentUserId },
  } = session;

  const { groups, templates } = useTemplateGroups();

  const { register, handleSubmit, reset, errors } = useForm({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const gqlClient = useGqlClient();

  /* get shared item (if it's a template, search in both groups
  and templates without a group */
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

  // get all users to whom the item is already shared
  const getUsersSharedTo = async () => {
    try {
      let userIdsSharedTo;
      let ids;

      if (type === 'group') {
        userIdsSharedTo = await gqlClient.request(getUsersTemplateGroupSharedTo, {
          groupId: id,
        });
        ids = userIdsSharedTo.shared_template_groups.map((item) => item.shared_to_user_id);
      } else {
        userIdsSharedTo = await gqlClient.request(getUsersTemplateSharedTo, {
          templateId: id,
        });
        ids = userIdsSharedTo.shared_templates.map((item) => item.shared_to_user_id);
      }

      const { users } = await gqlClient.request(getUsersByIdsQuery, { ids });
      return users;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };

  const { data } = useSWR(`getSharedTo-${id}`, getUsersSharedTo);
  const usersSharedTo = data || [];

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
        const templateIdsInGroup = sharedItem.templates.map((t) => t.id);
        await Promise.all(
          templateIdsInGroup.map((id) =>
            gqlClient.request(shareTemplateQuery, {
              templateId: id,
              userTo: userShareTo.user_id,
              userBy: currentUserId,
            })
          )
        );
      }

      if (type === 'template') {
        await gqlClient.request(shareTemplateQuery, {
          templateId: id,
          userTo: userShareTo.user_id,
          userBy: currentUserId,
        });
      }

      setLoading(false);
      reset();
      // update list of users with whom the item is shared
      mutate(`getSharedTo-${id}`);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
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
        <div className={cx('users')}>
          {usersSharedTo.map((user) => (
            <div key={`${id}-${user.name}`}>{user.name}</div>
          ))}
        </div>
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
