import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './input.module.scss';

const cx = classNames.bind(styles);

const Input = (props) => {
  const { className: additionalClassName, register, label, type, errors, ...otherProps } = props;
  return (
    <label className={cx('group', additionalClassName)}>
      {label && <div className={cx('label')}>{label}</div>}
      <div>
        <input className={cx('input')} type={type} ref={register()} {...otherProps} />
        {errors && <div className={cx('error')}>{errors.message}</div>}
      </div>
    </label>
  );
};

Input.defaultProps = {
  type: 'text',
  error: null,
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
};

export default Input;
