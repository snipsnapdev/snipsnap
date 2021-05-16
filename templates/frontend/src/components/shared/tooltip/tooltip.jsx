import classNames from 'classnames/bind';
import React from 'react';

import styles from './tooltip.module.scss';

const cx = classNames.bind(styles);

const Tooltip = ({ className: additionalClassName, children }) => (
  <div className={cx('wrapper', additionalClassName)}>
    <span>?</span>
    <div className={cx('content')}>{children}</div>
  </div>
);

export default Tooltip;
