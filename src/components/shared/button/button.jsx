import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'next/link';
import styles from './button.module.scss';

const cx = classNames.bind(styles);

const Button = (props) => {
  const { className: additionalClassName, children, theme, type, to, ...otherProps } = props;

  const className = cx('button', `type-${type}`, `theme-${theme}`, additionalClassName);

  if (type === 'plus') {
    return to ? (
      <Link href={to}>
        <a className={className} {...otherProps} />
      </Link>
    ) : (
      <button className={className} {...otherProps} />
    );
  }
  return to ? (
    <Link href={to}>
      <a className={className} {...otherProps}>
        {children}
      </a>
    </Link>
  ) : (
    <button className={className} {...otherProps}>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.string,
  size: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
};

Button.defaultProps = {
  className: null,
  theme: 'primary',
  type: null,
  to: null,
};

export default Button;
