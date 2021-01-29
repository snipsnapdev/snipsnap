import classNames from 'classnames/bind';

import styles from './menu.module.scss';

const cx = classNames.bind(styles);
const Menu = ({ children, className: additionalClassName }) => (
  <div className={cx('menu', additionalClassName)}>{children}</div>
);

export default Menu;
