import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './input.module.scss';

const cx = classNames.bind(styles);

const Input = forwardRef((props, ref) => {
  const { className: additionalClassName, register, label, type, error, ...otherProps } = props;
  return (
    <div className={cx('wrapper', additionalClassName)}>
      {label && <div className={cx('label')}>{label}</div>}
      <div className={cx('input-wrapper')}>
        <input
          className={cx('input', { invalid: error })}
          type={type}
          ref={ref || register?.()}
          {...otherProps}
        />
        {error && <div className={cx('error')}>{error}</div>}
      </div>
    </div>
  );
});

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
