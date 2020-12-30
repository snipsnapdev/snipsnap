import React from 'react';
import classNames from 'classnames/bind';
import styles from './input.module.scss';

const cx = classNames.bind(styles);

const Input = ({ label }) => (
  <div className={cx('group')}>
    <label className={cx('label')}>{label}</label>
    <div>
      <input className={cx('input')} type="text" value="Hello world" />
    </div>
  </div>
);

export default Input;
