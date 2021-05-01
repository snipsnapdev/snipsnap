import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Menu from 'components/shared/dropdown/menu';
import useOutsideClick from 'hooks/use-outside-click';
import IconDown from 'icons/arrow-down.inline.svg';

import styles from './dropdown.module.scss';

const cx = classNames.bind(styles);

const Dropdown = ({
  children,
  menu,
  className: additionalClassName,
  position,
  stopPropagation,
  menuClassName,
  showIcon,
  onClick,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggle = (e) => {
    setIsOpened(!isOpened);
    stopPropagation && e.stopPropagation();
    onClick && onClick();
  };

  const handleClickOutside = () => {
    setIsOpened(false);
  };
  const { register } = useOutsideClick(handleClickOutside, isOpened);

  return (
    <div
      ref={register}
      className={cx('wrapper', additionalClassName, { opened: isOpened })}
      onClick={toggle}
    >
      {children}
      {showIcon && (
        <div className={cx('icon', isOpened && 'up')}>
          <IconDown />
        </div>
      )}
      <Menu className={cx('menu', `position-${position}`, menuClassName)}>{menu}</Menu>
    </div>
  );
};

Dropdown.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-right', 'bottom-left']),
  showIcon: PropTypes.bool,
};

Dropdown.defaultProps = {
  position: 'top-left',
  showIcon: false,
};

export default Dropdown;
