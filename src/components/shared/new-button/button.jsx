import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './button.module.scss';
import Loader from './images/loader.inline.svg';

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
      <Tag className={className} disabled={isLoading} ref={ref} {...otherProps}>
        <span className={cx('content')}>{children}</span>
        {isLoading && <Loader className={cx('loader')} />}
      </Tag>
    );
  }
);

Button.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.oneOf(['button', 'a']),
  themeType: PropTypes.oneOf(['button', 'button-link', 'link']),
  themeColor: PropTypes.oneOf(['default', 'white', 'red']),
  size: PropTypes.oneOf(['default', 'md']),
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: null,
  themeType: 'button',
  themeColor: 'default',
  size: 'default',
  isLoading: false,
  tag: 'button',
};

export default Button;
