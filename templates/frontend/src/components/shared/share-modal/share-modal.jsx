import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import * as yup from 'yup';

import { gql, useGqlClient } from 'api/graphql';
import AsyncButton from 'components/shared/async-button';
import Avatar from 'components/shared/avatar';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';
import Switch from 'components/shared/switch';
import { useTemplateGroups } from 'contexts/template-groups-provider';

import styles from './share-modal.module.scss';

const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
});

const cx = classNames.bind(styles);

const getUsersTemplateGroupSharedTo = gql`
  query MyQuery($groupId: uuid!) {
    shared_template_groups(where: { template_group_id: { _eq: $groupId } }) {
      shared_to_user {
        id
        name
        image
        email
      }
    }
  }
`;

const getUsersTemplateSharedTo = gql`
  query MyQuery($templateId: uuid!) {
    shared_templates(where: { template_id: { _eq: $templateId } }) {
      shared_to_user_id
      shared_to_user {
        id
        name
        image
        email
      }
    }
  }
`;

const shareTemplateGroupQuery = gql`
  mutation shareTemplateGroup($groupId: String!, $shareToUserEmail: String!) {
    share_template_group(
      object: { template_group_id: $groupId, share_to_user_email: $shareToUserEmail }
    ) {
      id
    }
  }
`;

const shareTemplateQuery = gql`
  mutation shareTemplate($templateId: String!, $shareToUserEmail: String!) {
    share_template(object: { template_id: $templateId, share_to_user_email: $shareToUserEmail }) {
      id
    }
  }
`;

// unsharing
const unshareTemplateGroupQuery = gql`
  mutation unshareTemplateGroup($groupId: String!, $shareToUserEmail: String!) {
    unshare_template_group(
      object: { template_group_id: $groupId, share_to_user_email: $shareToUserEmail }
    ) {
      shared_to_user_id
    }
  }
`;

const unshareTemplateQuery = gql`
  mutation shareTemplate($templateId: String!, $shareToUserEmail: String!) {
    unshare_template(object: { template_id: $templateId, share_to_user_email: $shareToUserEmail }) {
      shared_to_user_id
    }
  }
`;

const shareTemplateToAllQuery = gql`
  mutation shareTemplate($templateId: uuid!, $isPublic: Boolean!) {
    update_templates_by_pk(pk_columns: { id: $templateId }, _set: { is_public: $isPublic }) {
      id
      is_public
    }
  }
`;

// get public status
const getTemplatePublicStatusQuery = gql`
  query MyQuery($templateId: uuid!) {
    templates(where: { id: { _eq: $templateId } }) {
      id
      is_public
    }
  }
`;

const ShareModal = (props) => {
  const { id, type, isOpen, onClose } = props;

  const { groups, templates } = useTemplateGroups();

  const { register, handleSubmit, reset, errors } = useForm({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const gqlClient = useGqlClient();

  // const [isPublic, setIsPublic] = useState(false);

  const checkPublic = async () => {
    if (type === 'group') {
      return false;
    }
    const res = await gqlClient.request(getTemplatePublicStatusQuery, {
      templateId: id,
    });
    return res.templates[0].is_public;
  };

  const { data: isPublic } = useSWR(`isPublic-${id}`, checkPublic);

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
      let users;

      if (type === 'group') {
        const res = await gqlClient.request(getUsersTemplateGroupSharedTo, {
          groupId: id,
        });
        users = res?.shared_template_groups.map((item) => item.shared_to_user) || [];
      } else {
        const res = await gqlClient.request(getUsersTemplateSharedTo, {
          templateId: id,
        });
        users = res?.shared_templates.map((item) => item.shared_to_user) || [];
      }
      return users;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };

  const { data } = useSWR(`getSharedTo-${id}`, getUsersSharedTo);
  const usersSharedTo = data || [];

  const onSubmit = async ({ email: shareToUserEmail }) => {
    try {
      if (type === 'group') {
        // share group with user
        await gqlClient.request(shareTemplateGroupQuery, {
          groupId: id,
          shareToUserEmail,
        });

        // share all templates within the group with user
        const templateIdsInGroup = sharedItem.templates.map((t) => t.id);
        await Promise.all(
          templateIdsInGroup.map((id) =>
            gqlClient.request(shareTemplateQuery, {
              templateId: id,
              shareToUserEmail,
            })
          )
        );
      }

      if (type === 'template') {
        await gqlClient.request(shareTemplateQuery, {
          templateId: id,
          shareToUserEmail,
        });
      }

      reset();
      // update list of users with whom the item is shared
      mutate(`getSharedTo-${id}`);
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleError = (error) => {
    console.error('Sharing failed', error);
  };

  if (!isOpen) {
    return null;
  }

  const handleUnshare = async (shareToUserEmail) => {
    try {
      if (type === 'group') {
        await gqlClient.request(unshareTemplateGroupQuery, {
          groupId: id,
          shareToUserEmail,
        });
      } else {
        await gqlClient.request(unshareTemplateQuery, {
          templateId: id,
          shareToUserEmail,
        });
      }
      mutate(`getSharedTo-${id}`);
    } catch (err) {
      console.log('err');
    }
  };

  const handlePublicSwitch = async () => {
    await gqlClient.request(shareTemplateToAllQuery, {
      templateId: id,
      isPublic: !isPublic,
    });
    mutate(`isPublic-${id}`);
  };

  return (
    <ModalPortal>
      <Modal title={`Share "${sharedItem.name}" ${type}`} isOpen={isOpen} onRequestClose={onClose}>
        <form>
          <div className={cx('top')}>
            <Input
              label="Email for invitation"
              name="email"
              register={register}
              errors={errors.email}
              className={cx('input')}
            />
            <AsyncButton
              className={cx('send-button')}
              type="submit"
              text="Send invite"
              successText="sent"
              onClick={handleSubmit(onSubmit)}
              onError={handleError}
            />
          </div>
        </form>
        {type === 'template' && (
          <Switch
            isChecked={isPublic}
            label="Public availability"
            className={cx('switch')}
            onChange={handlePublicSwitch}
          />
        )}
        {Boolean(usersSharedTo.length) && (
          <div className={cx('users')}>
            {usersSharedTo.map((user) => (
              <div key={`${id}-${user.name}`} className={cx('user')}>
                <Avatar userName={user.name} avatar={user.image} />
                <span className={cx('name')}>{user.name}</span>
                <span className={cx('email')}>({user.email})</span>
                <button className={cx('unshare')} onClick={() => handleUnshare(user.email)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
