import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import DeleteTemplateModal from 'components/shared/delete-template-modal';
import Dropdown from 'components/shared/dropdown';
import ShareModal from 'components/shared/share-modal';
import useSession from 'hooks/use-session';
import DotsSvg from 'icons/dots-menu.inline.svg';
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

const TemplateItem = ({ name, templateId, favourite = false }) => {
  const [session] = useSession();
  const { asPath } = useRouter();

  const {
    user: { id: currentUserId },
  } = session;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const gqlClient = useGqlClient();

  const handleFavouriteClick = async () => {
    try {
      await gqlClient.request(query, { templateId, userId: currentUserId, favourite: !favourite });
      mutate('getOwnedTemplateGroups');
    } catch (error) {
      console.log('error');
    }
  };

  const templateMenu = (
    <>
      <div onClick={() => setIsShareModalOpen(true)}>Share</div>
      <div onClick={handleFavouriteClick}>{favourite ? 'Remove from' : 'Add to'} favourites</div>
      <div style={{ color: '#FF6666' }} onClick={() => setIsDeleteModalOpen(true)}>
        Delete
      </div>
    </>
  );

  const hrefPath = `/template/${templateId}`;
  const isActive = asPath === hrefPath;

  return (
    <Link href={hrefPath}>
      <div className={cx('wrapper', { active: isActive })}>
        <div className={cx('inner')}>
          <span className={cx('name')}>{name}</span>
          <div className={cx('options')}>
            <Dropdown
              menu={templateMenu}
              className={cx('options-inner')}
              menuClassName={cx('menu')}
              position="top-right"
              stopPropagation
            >
              <DotsSvg className={cx('options-icon')} />
            </Dropdown>
          </div>
          {favourite && <StarIcon className={cx('star')} />}
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
        </div>
      </div>
    </Link>
  );
};

export default TemplateItem;