import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './dropdown-menu.module.scss';

const cx = classNames.bind(styles);

const DropdownMenu = ({ className: additionalClassName, isOpen, children }) => <div className={cx('wrapper', { active: isOpen }, additionalClassName)}>{children}</div>;

DropdownMenu.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

DropdownMenu.defaultProps = {
  isOpen: false,
  children: `Dropdown`,
};

export default DropdownMenu;
