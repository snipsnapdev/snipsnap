import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import DeleteTemplateModal from 'components/shared/delete-template-modal';
import Dropdown from 'components/shared/dropdown';
import ShareModal from 'components/shared/share-modal';
import UnshareModal from 'components/shared/unshare-modal';
import useSession from 'hooks/use-session';
import DotsIcon from 'icons/dots.inline.svg';
import StarIcon from 'icons/star.inline.svg';

import styles from './template-item.module.scss';

const cx = classNames.bind(styles);

const query = gql`
  mutation updateTemplateFavourite($templateId: uuid!, $userId: uuid!, $favourite: Boolean!) {
    update_user_available_templates(
      where: { template_id: { _eq: $templateId }, available_for_user_id: { _eq: $userId } }
      _set: { favourite: $favourite }
    ) {
      returning {
        template_id
      }
    }
  }
`;

const TemplateItem = ({ name, templateId, favourite = false, shared = false }) => {
  const [session] = useSession();
  const { asPath } = useRouter();

  const {
    user: { id: currentUserId },
  } = session;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // un-share template shared with the current user
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const gqlClient = useGqlClient();

  const handleFavouriteClick = async () => {
    try {
      await gqlClient.request(query, { templateId, userId: currentUserId, favourite: !favourite });
      mutate('getOwnedTemplateGroups');
    } catch (error) {
      console.log('error');
    }
  };

  const menuItems = [
    ...(shared
      ? []
      : [
          {
            text: 'Share',
            onClick: () => setIsShareModalOpen(true),
          },
        ]),
    {
      text: `${favourite ? 'Remove from' : 'Add to'} favourites`,
      onClick: handleFavouriteClick,
    },
    ...(shared
      ? []
      : [
          {
            text: 'Delete',
            onClick: () => setIsDeleteModalOpen(true),
            theme: 'danger',
          },
        ]),
    // un-share template shared with the current user
    ...(!shared
      ? []
      : [
          {
            text: 'Remove',
            onClick: () => setIsRemoveModalOpen(true),
            theme: 'danger',
          },
        ]),
  ];

  const hrefPath = `/template/${templateId}`;
  const isActive = asPath === hrefPath;

  return (
    <>
      <Link href={hrefPath}>
        <div className={cx('wrapper', { active: isActive })}>
          <div className={cx('inner')}>
            <span className={cx('name')}>{name}</span>
            <Dropdown
              menuItems={menuItems}
              className={cx('options')}
              menuClassName={cx('menu')}
              position="top-right"
              stopPropagation
            >
              <DotsIcon className={cx('options-icon')} />
            </Dropdown>
            {favourite && <StarIcon className={cx('star')} />}
          </div>
        </div>
      </Link>
      {isDeleteModalOpen && (
        <DeleteTemplateModal
          id={templateId}
          name={name}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isShareModalOpen && (
        <ShareModal
          id={templateId}
          type="template"
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
      {isRemoveModalOpen && (
        <UnshareModal
          id={templateId}
          name={name}
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
        />
      )}
    </>
  );
};

TemplateItem.propTypes = {
  name: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
  favourite: PropTypes.bool,
  shared: PropTypes.bool,
};

TemplateItem.defaultProps = {
  favourite: false,
  shared: false,
};

export default TemplateItem;
