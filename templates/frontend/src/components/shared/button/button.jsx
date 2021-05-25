import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './button.module.scss';
import LoaderIcon from './images/loader.inline.svg';
import SuccessIcon from './images/success.inline.svg';

const cx = classNames.bind(styles);

const Button = forwardRef(
  (
    {
      className: additionalClassName,
      tag: Tag,
      children,
      themeType,
      themeColor,
      size,
      width,
      isLoading,
      ...otherProps
    },
    ref
  ) => {
    const className = cx(
      'wrapper',
      {
        [`type_${themeType}`]: themeType,
        [`color_${themeColor}`]: themeColor,
        [`size_${size}`]: size,
        loading: isLoading,
      },
      additionalClassName
    );

    return (
      <Tag
        className={className}
        disabled={isLoading}
        ref={ref}
        {...(width ? { style: { width } } : {})}
        {...otherProps}
      >
        {themeColor === 'success' && <SuccessIcon className={cx('success-icon')} />}
        <span className={cx('content')}>{children}</span>
        {isLoading && <LoaderIcon className={cx('loader')} />}
      </Tag>
    );
  }
);

Button.propTypes = {
  width: PropTypes.number,
  className: PropTypes.string,
  tag: PropTypes.oneOf(['button', 'a']),
  themeType: PropTypes.oneOf(['button', 'button-link', 'link']),
  themeColor: PropTypes.oneOf(['default', 'white', 'red', 'success', 'custom']),
  size: PropTypes.oneOf(['default', 'md']),
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  width: undefined,
  className: null,
  themeType: 'button',
  themeColor: 'default',
  size: 'default',
  isLoading: false,
  tag: 'button',
};

export default Button;
