import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';

import useOutsideClick from 'hooks/use-outside-click';
import CloseSvg from 'icons/close.inline.svg';

import styles from './modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ title, children, isOpen, onRequestClose, theme }) => {
  const { register } = useOutsideClick(onRequestClose, isOpen);
  return (
    <div className={cx('wrapper', theme, { open: isOpen })}>
      <div className={cx('content-wrapper')}>
        <div className={cx('content')} ref={register}>
          <h2 className={cx('title')}>{title}</h2>
          <div className={cx('body')}>{children}</div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  theme: PropTypes.oneOf(['blurred', 'transparent']),
};

Modal.defaultProps = {
  theme: 'blurred',
};

export default Modal;
