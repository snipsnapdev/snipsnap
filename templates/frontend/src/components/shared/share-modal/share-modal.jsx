import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactTooltip from 'react-tooltip';
import useSWR, { mutate } from 'swr';
import * as yup from 'yup';

import { useGqlClient } from 'api/graphql';
import {
  shareTemplateToAllMutation,
  shareTemplateGroupMutation,
  shareTemplateMutation,
  unshareTemplateMutation,
  unshareTemplateGroupMutation,
} from 'api/mutations';
import {
  getUsersTemplateGroupSharedTo,
  getUsersTemplateSharedTo,
  getTemplatePublicStatusQuery,
} from 'api/queries';
import AsyncButton from 'components/shared/async-button';
import Avatar from 'components/shared/avatar';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';
import Switch from 'components/shared/switch';
import { useTemplateGroups } from 'contexts/template-groups-provider';

import Tooltip from '../tooltip';

import styles from './share-modal.module.scss';

const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
});

const cx = classNames.bind(styles);

const ShareModal = (props) => {
  const { id, type, isOpen, onClose } = props;

  const { groups, templates } = useTemplateGroups();

  const { register, handleSubmit, reset, errors, setError, getValues } = useForm({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });

  const gqlClient = useGqlClient();

  // Rebuild ReactTooltip for positioning when a modal has opened
  useEffect(() => {
    ReactTooltip.rebuild();
  });

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
    console.log('submitting', shareToUserEmail);
    try {
      if (type === 'group') {
        // share group with user
        await gqlClient.request(shareTemplateGroupMutation, {
          groupId: id,
          shareToUserEmail,
        });
      }

      if (type === 'template') {
        await gqlClient.request(shareTemplateMutation, {
          templateId: id,
          shareToUserEmail,
        });
      }

      reset();
      // update list of users with whom the item is shared
      mutate(`getSharedTo-${id}`);
    } catch (error) {
      const errorMessage = JSON.parse(JSON.stringify(error)).response.errors[0].message;
      throw new Error(errorMessage);
    }
  };

  const handleError = (error) => {
    setError('email', { message: error.message });
  };

  const handleUnshare = async (shareToUserEmail) => {
    try {
      if (type === 'group') {
        await gqlClient.request(unshareTemplateGroupMutation, {
          groupId: id,
          shareToUserEmail,
        });
      } else {
        await gqlClient.request(unshareTemplateMutation, {
          templateId: id,
          shareToUserEmail,
        });
      }
      mutate(`getSharedTo-${id}`);
    } catch (err) {
      throw new Error(`Unshare failed: ${err}`);
    }
  };

  const handlePublicSwitch = async () => {
    await gqlClient.request(shareTemplateToAllMutation, {
      templateId: id,
      isPublic: !isPublic,
    });
    mutate(`isPublic-${id}`);
  };

  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const emailInput = document.getElementById('email-input');
      emailInput.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <Modal
        theme="grey"
        title={`Share <span>"${sharedItem.name}"</span> ${type}`}
        isOpen={isOpen}
        hasGradient={Boolean(usersSharedTo.length > 6)}
        onRequestClose={onClose}
      >
        <form>
          <div className={cx('top')}>
            <Input
              id="email-input"
              label="Email for invitation"
              name="email"
              ref={register}
              error={errors.email?.message}
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
          <div className={cx('public-share')}>
            <Switch
              isChecked={isPublic}
              label="Public availability"
              className={cx('switch')}
              onChange={handlePublicSwitch}
            />

            <Tooltip dataFor="tooltip-modal" />
          </div>
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
  availabilityTooltip: PropTypes.string,
  documentationURL: PropTypes.string,
};

ShareModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default ShareModal;
