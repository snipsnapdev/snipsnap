import Input from 'components/shared/input';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './create-template.module.scss';
import Prompts from './prompts';

const cx = classNames.bind(styles);

const CreateTemplate = (props) => (
  <div>
    <div className={cx('left-column')}>
      <h1 className={cx('title')}>Create template</h1>
      <div className={cx('main')}>
        <Input label="Template name" />
      </div>
      <Prompts />
    </div>
  </div>
);

export default CreateTemplate;
