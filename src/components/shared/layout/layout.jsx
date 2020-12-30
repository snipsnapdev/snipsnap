import Sidebar from 'components/shared/sidebar';
import React from 'react';
import styles from './layout.module.scss';

const Layout = ({ children }) => (
  <div>
    <Sidebar />
    {children}
  </div>
);

export default Layout;
