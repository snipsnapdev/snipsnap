import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Clock from './icons/clock-icon.inline.svg';
import Search from './icons/search-icon.inline.svg';
import styles from './menu.module.scss';

const cx = classNames.bind(styles);

const icons = {
  search: Search,
  clock: Clock,
};

const Menu = ({ items }) => (
  <div className={cx('wrapper')}>
    {items.map(({ text, iconName }, index) => {
      const Icon = icons[iconName];
      return (
        <button className={cx('button')} key={index}>
          <Icon className={cx('icon')} />
          {text}
        </button>
      );
    })}
  </div>
);

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
    })
  ),
};

Menu.defaultProps = {
  items: [
    {
      text: 'Search',
      iconName: 'search',
    },
    {
      text: 'Recent',
      iconName: 'clock',
    },
  ],
};

export default Menu;
