import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'next/link';

import styles from './sidebar.module.scss';
import Search from './icons/search-icon.svg';
import Clock from './icons/clock-icon.svg';

const cx = classNames.bind(styles);

const Sidebar = ({ userName }) => {
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
        <Link href="#">
          <a className={cx('button')}>Create Template</a>
        </Link>
      </div>
      <div className={cx('search-wrapper')}>
        <button>
          <Search className={cx('icon')} />
          Search
        </button>
        <button>
          <Clock className={cx('icon')} />
          Recent
        </button>
      </div>
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
