import classNames from 'classnames/bind';
import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from './menu.module.scss';

const cx = classNames.bind(styles);
const Menu = ({ items, hasIcons, className }) => (
  <div className={cx('menu', className)}>
    {items &&
      items.map((item) => {
        const { text, icon: Icon, tagName: Tag = 'div', onClick, href, theme } = item;

        if (Tag === 'Link') {
          return (
            <Link key={text} href={href}>
              <a className={cx('item', theme)}>{text}</a>
            </Link>
          );
        }

        return (
          <Tag key={text} className={cx('item', theme)} onClick={onClick}>
            {hasIcons && <Icon />}
            {text}
          </Tag>
        );
      })}
  </div>
);

Menu.propTypes = {
  className: PropTypes.string,
  hasIcons: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      tagName: PropTypes.oneOf(['div', 'Link', 'button']),
      onClick: PropTypes.func,
      href: PropTypes.string,
      theme: PropTypes.oneOf(['default', 'danger', 'grey']),
    })
  ),
};

Menu.defaultProps = {
  className: '',
  hasIcons: false,
  items: [],
};

export default Menu;
