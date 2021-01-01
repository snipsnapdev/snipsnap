import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'next/link';
import styles from './button.module.scss';

const cx = classNames.bind(styles);

const Button = (props) => {
  const {
    className: additionalClassName,
    children,
    theme,
    size,
    icon: Icon,
    loading,
    to,
    ...otherProps
  } = props;

  const className = cx(
    'button',
    `theme-${theme}`,
    `size-${size}`,
    { loading },
    additionalClassName
  );

  const renderIcon = () =>
    Icon && (
      <span className={cx('icon-wrapper')}>
        <Icon className={cx('icon')} />
      </span>
    );

  return to ? (
    <Link href={to}>
      <a className={className} {...otherProps}>
        {renderIcon()}
        {children}
      </a>
    </Link>
  ) : (
    <button className={className} {...otherProps}>
      {renderIcon()}
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  size: PropTypes.oneOf(['md', 'lg']),
  loading: PropTypes.bool,
};

Button.defaultProps = {
  className: null,
  theme: 'primary',
  to: null,
  size: 'md',
  loading: false,
  icon: null,
};

export default Button;
