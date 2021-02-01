import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Menu from 'components/shared/dropdown/menu';
import useOutsideClick from 'hooks/use-outside-click';

import styles from './dropdown.module.scss';

const cx = classNames.bind(styles);

const Dropdown = ({
  children,
  menu,
  className: additionalClassName,
  position,
  stopPropagation,
  menuClassName,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggle = (e) => {
    setIsOpened(!isOpened);
    stopPropagation && e.stopPropagation();
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
      <Menu className={cx('menu', `position-${position}`, menuClassName)}>{menu}</Menu>
    </div>
  );
};

Dropdown.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-right']),
};

Dropdown.defaultProps = {
  position: 'top-left',
};

export default Dropdown;
