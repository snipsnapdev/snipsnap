import Sidebar from 'components/shared/sidebar';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './layout.module.scss';

const cx = classNames.bind(styles);

const Layout = ({ children }) => (
  <div>
    <Sidebar />
    <div className={cx('main')}>{children}</div>
  </div>
);

export default Layout;
