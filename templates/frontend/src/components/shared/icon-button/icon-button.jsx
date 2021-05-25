import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './icon-button.module.scss';
import PlusSvg from './icons/plus.inline.svg';

const cx = classNames.bind(styles);

const ICONS = {
  plus: PlusSvg,
};

const IconButton = ({ className: additionalClassName, icon, ...otherProps }) => {
  const Icon = ICONS[icon.name];

  return (
    <button className={cx('wrapper', additionalClassName)} type="button" {...otherProps}>
      <Icon className={cx('icon')} width={icon.size} />
    </button>
  );
};

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.shape({
    name: PropTypes.oneOf(['plus']).isRequired,
    size: PropTypes.number,
  }).isRequired,
};

IconButton.defaultProps = {
  className: null,
};

export default IconButton;
