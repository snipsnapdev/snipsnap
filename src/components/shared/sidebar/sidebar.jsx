import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Button from 'components/shared/button';
import DropdownMenu from 'components/shared/dropdown-menu';
import Input from 'components/shared/input';
import Menu from './menu/menu';

import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = ({ userName, buttonText }) => {
  const avatar = userName.slice(0, 1);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-wrapper')}>
        <div className={cx('user-info')}>
          <div className={cx('avatar-wrapper')}>
            <div className={cx('avatar')}>{avatar}</div>
          </div>
          <span>{userName}</span>

          <DropdownMenu className={cx('user-info-dropdown')}>
            <a href="/api/auth/signout">Log out</a>
          </DropdownMenu>
        </div>
        <Button theme="primary">{buttonText}</Button>
      </div>
      <Menu />
      <div className={cx('templates')}>
        <h3>Templates groups</h3>
        <Button type="plus" />
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
