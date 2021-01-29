import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './icon-button.module.scss';
import PlusSvg from './icons/plus.inline.svg';

const cx = classNames.bind(styles);

const ICONS = {
  plus: PlusSvg,
};

const IconButton = (props) => {
  const { className: additionalClassName, theme, size, icon, ...otherProps } = props;
  const Icon = ICONS[icon];
  return (
    <button
      type="button"
      className={cx('wrapper', `size-${size}`, `theme-${theme}`, additionalClassName)}
      {...otherProps}
    >
      <Icon />
    </button>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm']),
  icon: PropTypes.oneOf(['plus']).isRequired,
};

IconButton.defaultProps = {
  className: null,
  theme: 'primary',
  size: 'sm',
};

export default IconButton;
