import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import Menu from 'components/shared/dropdown/menu';

import styles from './dropdown.module.scss';

const cx = classNames.bind(styles);

const Dropdown = ({
  children,
  menu,
  className: additionalClassName,
  position,
  stopPropagation,
}) => {
  const node = useRef();
  const [isOpened, setIsOpened] = useState(false);

  const toggle = (e) => {
    setIsOpened(!isOpened);
    stopPropagation && e.stopPropagation();
  };

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpened]);

  return (
    <div
      ref={node}
      className={cx('wrapper', additionalClassName, { opened: isOpened })}
      onClick={toggle}
    >
      {children}
      <Menu className={cx('menu', `position-${position}`)}>{menu}</Menu>
    </div>
  );
};

Dropdown.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right']),
};

Dropdown.defaultProps = {
  position: 'top-left',
};

export default Dropdown;
