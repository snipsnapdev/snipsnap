import classNames from 'classnames/bind';
import Link from 'next/link';
import PropTypes from 'prop-types';

import styles from './button.module.scss';
import loaderSvg from './loader.url.svg';

const cx = classNames.bind(styles);

const Button = (props) => {
  const {
    className: additionalClassName,
    children,
    theme,
    size,
    icon: Icon,
    loading,
    type,
    to,
    disabled,
    ...otherProps
  } = props;
  const withIcon = !!Icon;
  const className = cx(
    'button',
    `theme-${theme}`,
    `size-${size}`,
    { loading },
    additionalClassName,
    { 'with-icon': withIcon }
  );

  const renderIcon = () =>
    Icon && (
      <span className={cx('icon-wrapper')}>
        <Icon className={cx('icon')} />
        {loading && (
          <span className={cx('loader')}>
            <img src={loaderSvg} />
          </span>
        )}
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
    <button type={type} className={className} disabled={disabled} {...otherProps}>
      {renderIcon()}
      <span className={cx('text')}>{children}</span>
      {!withIcon && loading && (
        <span className={cx('loader')}>
          <img src={loaderSvg} />
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.node,
  theme: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  size: PropTypes.oneOf(['md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: null,
  theme: 'primary',
  to: null,
  size: 'md',
  loading: false,
  disabled: false,
  icon: null,
};

export default Button;
