import classNames from 'classnames/bind';
import { useState } from 'react';

import useOutsideClick from 'hooks/use-outside-click';
import CloseSvg from 'icons/close.inline.svg';

import styles from './modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ title, children, isOpen, onRequestClose }) => {
  const { register } = useOutsideClick(onRequestClose, isOpen);
  return (
    <div className={cx('wrapper', { open: isOpen })}>
      <div className={cx('content-wrapper')}>
        <div className={cx('content')} ref={register}>
          <h2 className={cx('title')}>{title}</h2>
          <div className={cx('body')}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
