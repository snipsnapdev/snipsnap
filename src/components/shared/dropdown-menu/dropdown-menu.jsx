import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './dropdown-menu.module.scss';

const cx = classNames.bind(styles);

const DropdownMenu = ({ className: additionalClassName, children }) => {
  const wrapperRef = useRef();

  const handleClose = ({ target }) => {
    const { current: dropdown } = wrapperRef;
    const parentDropdown = dropdown.parentNode;

    if (!parentDropdown.contains(target) && !dropdown.contains(target)) {
      dropdown.classList.remove(`${styles.active}`);
    } else {
      dropdown.classList.add(`${styles.active}`);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, []);

  return (
    <div className={cx('wrapper', additionalClassName)} ref={wrapperRef}>
      {children}
    </div>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.objectOf(PropTypes.any),
};

DropdownMenu.defaultProps = {
  children: `Dropdown`,
};

export default DropdownMenu;
