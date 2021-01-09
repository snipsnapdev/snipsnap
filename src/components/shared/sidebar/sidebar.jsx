import classNames from 'classnames/bind';
import { signOut, useSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import Input from 'components/shared/input';

import Avatar from '../avatar';
import Button from '../button';
import IconButton from '../icon-button';
import Modal from '../modal';
import ModalPortal from '../modal-portal';
import TemplatesGroupsTree from '../templates-groups-tree';

import Menu from './menu/menu';
import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
  const [session] = useSession();
  const {
    user: { name: userName, image: avatar },
  } = session;

  const userMenu = (
    <>
      <a href="/" onClick={() => signOut()}>
        Log Out
      </a>
    </>
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-wrapper')}>
        <Dropdown menu={userMenu} className={cx('user-info')}>
          <Avatar userName={userName} avatar={avatar} className={cx('avatar')} />
          <span>{userName}</span>
        </Dropdown>
        <Button to="/create-template" theme="primary">
          Create Template
        </Button>
      </div>
      <Menu />
      <div className={cx('templates')}>
        <h2>
          Templates groups
          <IconButton
            icon="plus"
            className={cx('group-create-button')}
            onClick={() => setIsModalOpen(true)}
          />
          {isModalOpen && (
            <ModalPortal>
              <Modal
                title="Add folder"
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
              >
                <Button>Add group</Button>
              </Modal>
            </ModalPortal>
          )}
        </h2>
        <TemplatesGroupsTree />
      </div>
    </div>
  );
};

export default Sidebar;
