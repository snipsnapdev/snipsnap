import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { signIn, signOut } from 'next-auth/client';
import Button from 'components/shared/button/button';
import DropdownMenu from 'components/shared/dropdown-menu/dropdown-menu';
import Input from 'components/shared/input';
import Menu from './menu/menu';

import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = ({ userName, buttonText }) => {
  const avatar = userName.slice(0, 1);
  const [isDropDownUserOpen, setIsDropDownUserOpen] = useState(false);

  const handleUserClick = () => {
    setIsDropDownUserOpen(!isDropDownUserOpen);
  };
  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-wrapper')} onClick={handleUserClick}>
        <div className={cx('user-info')}>
          <div className={cx('avatar-wrapper')}>
            <div className={cx('avatar')}>{avatar}</div>
          </div>
          <span>{userName}</span>

          <DropdownMenu className={cx('user-info-dropdown')} isOpen={isDropDownUserOpen}>
            <button onClick={signIn}>Sign in</button>
            <button onClick={signOut}>Log out</button>
          </DropdownMenu>
        </div>
        <Button theme="primary" to="#">
          {buttonText}
        </Button>
      </div>
      <Menu />
      <div className={cx('templates')}>
        <h3>Templates groups</h3>
        <Button type="plus" to="#" />
      </div>
    </div>
  );
};

Sidebar.propTypes = {};

Sidebar.defaultProps = {
  userName: 'Alex Barashkov',
  buttonText: 'Create template',
};

export default Sidebar;
