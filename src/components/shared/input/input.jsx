import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './input.module.scss';

const cx = classNames.bind(styles);

const Input = (props) => {
  const { className: additionalClassName, register, label, type, error, ...otherProps } = props;
  return (
    <label className={cx('wrapper', additionalClassName)}>
      {label && <div className={cx('label')}>{label}</div>}
      <div className={cx('input-wrapper')}>
        <input
          className={cx('input', { invalid: error })}
          type={type}
          ref={register?.()}
          {...otherProps}
        />
        {error && <div className={cx('error')}>{error}</div>}
      </div>
    </label>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  error: null,
  label: null,
  className: '',
};

export default Input;
