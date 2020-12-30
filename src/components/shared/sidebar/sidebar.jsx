import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'next/link';
import { signOut } from 'next-auth/client';
import Menu from './menu/menu';

import styles from './sidebar.module.scss';
import DropdownMenu from '../dropdown-menu/dropdown-menu';

const cx = classNames.bind(styles);

const Sidebar = ({ userName }) => {
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
            <button onClick={signOut}>Log out</button>
          </DropdownMenu>
        </div>
        <Link href="#">
          <a className={cx('button')}>Create Template</a>
        </Link>
      </div>
      <Menu />
      <div className={cx('templates')}>
        <h3>Templates groups</h3>
        <Link href="#">
          <a />
        </Link>
      </div>
    </div>
  );
};

Sidebar.propTypes = {};

Sidebar.defaultProps = {
  userName: 'Alex Barashkov',
};

export default Sidebar;
