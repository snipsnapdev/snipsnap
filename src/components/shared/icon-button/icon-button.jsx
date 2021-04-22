import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './icon-button.module.scss';
import PlusSvg from './icons/plus.inline.svg';

const cx = classNames.bind(styles);

const ICONS = {
  plus: PlusSvg,
};

const IconButton = ({
  className: additionalClassName,
  size,
  icon,
  iconSize,
  theme,
  ...otherProps
}) => {
  const Icon = ICONS[icon];

  return (
    <button
      className={cx('wrapper', `size-${size}`, `theme-${theme}`, additionalClassName)}
      type="button"
      {...otherProps}
    >
      <Icon width={iconSize} />
    </button>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md']),
  icon: PropTypes.oneOf(['plus']).isRequired,
  iconSize: PropTypes.number,
  theme: PropTypes.oneOf(['primary']),
};

IconButton.defaultProps = {
  className: null,
  size: 'md',
  theme: 'primary',
  iconSize: null,
};

export default IconButton;
