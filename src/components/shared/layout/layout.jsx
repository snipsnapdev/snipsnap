import classNames from 'classnames/bind';

import Sidebar from 'components/shared/sidebar';

import styles from './layout.module.scss';

const cx = classNames.bind(styles);

const Layout = ({ children }) => (
  <div className={cx('wrapper')}>
    <Sidebar />
    <div className={cx('main')}>{children}</div>
  </div>
);

export default Layout;
