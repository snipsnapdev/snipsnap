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
          <div className={cx('close')} onClick={onRequestClose}>
            <CloseSvg />
          </div>
          <div className={cx('header')}>
            <h2>{title}</h2>
          </div>
          <div className={cx('body')}>{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
