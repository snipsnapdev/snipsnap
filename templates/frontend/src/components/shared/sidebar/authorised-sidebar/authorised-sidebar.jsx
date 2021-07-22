import classNames from 'classnames/bind';
import { signOut } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Avatar from 'components/shared/avatar';
import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';
import useSession from 'hooks/use-session';
import HomeIcon from 'icons/home.inline.svg';
import MarketplaceIcon from 'icons/marketplace.inline.svg';

import CreateTemplateGroupModal from '../../create-template-group-modal';

import styles from './authorised-sidebar.module.scss';
import TemplatesGroupsTree from './templates-groups-tree';

const cx = classNames.bind(styles);

const userMenuItems = [
  {
    text: 'Logout',
    theme: 'danger',
    onClick: signOut,
  },
];

const AuthorisedSidebar = () => {
  const [session] = useSession();
  const { push, asPath } = useRouter();

  const [isCreateTemplateGroupModalOpen, setIsCreateTemplateGroupModalOpen] = useState(false);

  const {
    user: { name: userName, image: avatar },
  } = session;

  const handleCreateTemplateButtonClick = () => push('/create-template');

  const creatButtonMenu = [
    {
      text: 'Create group',
      onClick: () => setIsCreateTemplateGroupModalOpen(true),
    },
    {
      text: 'Create template',
      onClick: handleCreateTemplateButtonClick,
    },
  ];

  const handleCreateTemplateGroupModalClose = () => setIsCreateTemplateGroupModalOpen(false);

  const isHomeLinkActive = asPath === '/';
  const isMarketplaceLinkActive = asPath === '/marketplace';

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>Templates</h1>
        <Dropdown
          menuItems={creatButtonMenu}
          className={cx('options-inner')}
          menuClassName={cx('menu')}
          position="top-left"
          stopPropagation
        >
          <IconButton icon={{ name: 'plus', size: 10 }} />
        </Dropdown>
      </div>

      <div className={cx('navigation')}>
        <Link href="/">
          <a className={cx('navigation-item', { active: isHomeLinkActive })}>
            <HomeIcon className={cx('navigation-item-icon')} />
            <span>Home</span>
          </a>
        </Link>
        <Link href="/marketplace">
          <a className={cx('navigation-item', { active: isMarketplaceLinkActive })}>
            <MarketplaceIcon className={cx('navigation-item-icon')} />
            <span>Marketplace</span>
          </a>
        </Link>
      </div>

      <TemplatesGroupsTree />

      <div className={cx('footer')}>
        <Dropdown className={cx('footer-item')} menuItems={userMenuItems} position="bottom-left">
          <Avatar avatar={avatar} userName={userName} />
          <span>{userName}</span>
        </Dropdown>
      </div>

      <CreateTemplateGroupModal
        isOpen={isCreateTemplateGroupModalOpen}
        onClose={handleCreateTemplateGroupModalClose}
      />
    </div>
  );
};

export default AuthorisedSidebar;
