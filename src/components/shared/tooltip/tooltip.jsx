import classNames from 'classnames/bind';
import React from 'react';

import styles from './tooltip.module.scss';

const cx = classNames.bind(styles);

const Tooltip = ({ className: additionalClassName, children, position = 'top' }) => (
  <div className={cx('wrapper', additionalClassName)}>
    <span>?</span>
    <div className={cx('content', `${position}`)} dangerouslySetInnerHTML={{ __html: children }} />
  </div>
);

export default Tooltip;