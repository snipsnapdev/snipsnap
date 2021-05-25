import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './switch.module.scss';

const cx = classNames.bind(styles);

const Switch = ({ className, isChecked, onChange, label }) => (
  <div className={cx('wrapper', className)}>
    <button
      className={cx('switch-button', {
        checked: isChecked,
      })}
      onClick={onChange}
    />
    <span className={cx('label')}>{label}</span>
  </div>
);

Switch.propTypes = {
  className: PropTypes.string,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

Switch.defaultProps = {
  className: '',
  isChecked: false,
  onChange: undefined,
  label: '',
};

export default Switch;
