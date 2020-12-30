import React from 'react';
import classNames from 'classnames/bind';
import styles from './tooltip.module.scss';

const cx = classNames.bind(styles);

const Tooltip = ({ children, position = 'top' }) => (
  <div className={cx('wrapper')}>
    <span>?</span>
    <div
      className={cx('content', {
        [`${position}`]: true,
      })}
    >
      {children}
    </div>
  </div>
);

export default Tooltip;
