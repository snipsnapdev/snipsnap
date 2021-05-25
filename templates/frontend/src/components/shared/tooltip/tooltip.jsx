import classNames from 'classnames/bind';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import styles from './tooltip.module.scss';

const cx = classNames.bind(styles);

const Tooltip = ({ className: additionalClassName, children, dataFor }) => (
  <>
    <div data-for={dataFor} className={cx('wrapper', additionalClassName)} data-tip>
      <span>?</span>
    </div>
  </>
);

export default Tooltip;
