import classNames from 'classnames/bind';
import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from './menu.module.scss';

const cx = classNames.bind(styles);
const Menu = ({ items, className }) => (
  <div className={cx('menu', className)}>
    {items &&
      items.map((item) => {
        const {
          text,
          tagName: Tag = 'div',
          onClick = undefined,
          href = undefined,
          theme = 'default',
        } = item;

        if (Tag === 'Link') {
          return (
            <Link key={text} href={href}>
              <a className={cx('item', theme === 'danger' && 'danger')}>{text}</a>
            </Link>
          );
        }

        return (
          <Tag key={text} className={cx('item', theme === 'danger' && 'danger')} onClick={onClick}>
            {text}
          </Tag>
        );
      })}
  </div>
);

Menu.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      tagName: PropTypes.oneOf(['div', 'Link', 'button']),
      onClick: PropTypes.func,
      href: PropTypes.string,
      theme: PropTypes.oneOf(['default', 'danger']),
    })
  ),
};

Menu.defaultProps = {
  className: '',
  items: [],
};

export default Menu;
