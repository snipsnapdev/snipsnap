import classNames from 'classnames/bind';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';
import useSession from 'hooks/use-session';
import MarketplaceIcon from 'icons/marketplace.inline.svg';

import Avatar from '../avatar';

import CreateTemplateGroupModal from './create-template-group-modal';
import styles from './sidebar.module.scss';
import TemplatesGroupsTree from './templates-groups-tree';

const cx = classNames.bind(styles);

const userMenu = (
  <>
    <button type="button" onClick={signOut}>
      Log Out
    </button>
  </>
);

const Sidebar = () => {
  const [session] = useSession();
  const router = useRouter();

  const [isCreateTemplateGroupModalOpen, setIsCreateTemplateGroupModalOpen] = useState(false);

  const {
    user: { name: userName, image: avatar },
  } = session;

  const handleCreateTemplateButtonClick = () => router.push('/create-template');
  const handleMarketplaceButtonClick = () => router.push('/marketplace');

  const createButtonMenu = (
    <>
      <div onClick={() => setIsCreateTemplateGroupModalOpen(true)}>Create group</div>
      <div onClick={handleCreateTemplateButtonClick}>Create template</div>
    </>
  );

  const handleCreateTemplateGroupModalClose = () => setIsCreateTemplateGroupModalOpen(false);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>Templates</h1>
        <Dropdown
          menu={createButtonMenu}
          className={cx('options-inner')}
          menuClassName={cx('menu')}
          position="top-right"
          stopPropagation
        >
          <IconButton icon="plus" size="md" iconSize={10} />
        </Dropdown>
      </div>

      <div className={cx('templates')}>
        <h3 className={cx('templates-title')}>My templates</h3>
        <TemplatesGroupsTree onlyOwned />
      </div>

      <div className={cx('templates')}>
        <h3 className={cx('templates-title')}>Shared with me templates</h3>
        <TemplatesGroupsTree onlyShared />
      </div>

      <div className={cx('footer')}>
        <div className={cx('footer-item')} onClick={handleMarketplaceButtonClick}>
          <MarketplaceIcon />
          <span>Marketplace</span>
        </div>
        <Dropdown className={cx('footer-item')} menu={userMenu} position="bottom-left">
          <Avatar avatar={avatar} />
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

export default Sidebar;
