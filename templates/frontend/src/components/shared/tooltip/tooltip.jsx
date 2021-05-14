import classNames from 'classnames/bind';
import React from 'react';

import styles from './tooltip.module.scss';

const cx = classNames.bind(styles);

const Tooltip = ({ className: additionalClassName, children, position }) => {
  console.log(children);
  return (
    <div className={cx('wrapper', additionalClassName)}>
      <span>?</span>
      <div
        className={cx('content', `${position}`)}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </div>
  );
};

Tooltip.defaultProps = {
  position: 'top',
};

export default Tooltip;
