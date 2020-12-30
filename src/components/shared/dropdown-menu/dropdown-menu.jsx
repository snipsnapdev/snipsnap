import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './dropdown-menu.module.scss';

const cx = classNames.bind(styles);

const DropdownMenu = ({ className: additionalClassName, isOpen, children }) => {
  const handleClose = ({ target }) => {
    const wrapper = document.querySelectorAll(`.${styles.wrapper}`);

    wrapper.forEach((dropdown) => {
      const parentDropdown = dropdown.parentNode;

      if (!parentDropdown.contains(target) && !dropdown.contains(target)) {
        dropdown.classList.remove(`${styles.active}`);
      } else {
        dropdown.classList.add(`${styles.active}`);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, []);

  return <div className={cx('wrapper', { active: isOpen }, additionalClassName)}>{children}</div>;
};

DropdownMenu.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.objectOf(PropTypes.any),
};

DropdownMenu.defaultProps = {
  isOpen: false,
  children: `Dropdown`,
};

export default DropdownMenu;
