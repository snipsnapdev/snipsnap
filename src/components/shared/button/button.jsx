import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Link from 'next/link';
import styles from './button.module.scss';

const cx = classNames.bind(styles);

const Button = (props) => {
  const { className: additionalClassName, children, theme, type, to, ...otherProps } = props;

  const className = cx(
    'button',
    `button_type_${type}`,
    `button_theme_${theme}`,
    additionalClassName
  );

  if (type === 'plus') {
    return (
      <Link href={to}>
        <a className={className} {...otherProps} />
      </Link>
    );
  }
  return (
    <Link href={to}>
      <a className={className} {...otherProps}>
        {children}
      </a>
    </Link>
  );
};

Button.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

Button.defaultProps = {
  className: null,
  theme: 'primary',
  type: null,
};

export default Button;
