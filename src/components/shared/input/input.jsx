import classNames from 'classnames/bind';

import styles from './input.module.scss';

const cx = classNames.bind(styles);

const Input = ({ label, name, register, required, errors }) => (
  <label className={cx('group')}>
    <div className={cx('label')}>{label}</div>
    <div>
      <input className={cx('input')} name={name} ref={register({ required })} type="text" />
      {errors && <div className={cx('error')}>{errors.message}</div>}
    </div>
  </label>
);

export default Input;
