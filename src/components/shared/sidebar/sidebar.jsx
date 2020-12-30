import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Menu from './menu/menu';

import styles from './sidebar.module.scss';
import Button from '../button/button';

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
