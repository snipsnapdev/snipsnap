import classNames from 'classnames/bind';

import styles from './template-select.module.scss';

const cx = classNames.bind(styles);

const TEMPLATES = ['Storybook for React Component', 'Dockerfile', 'NodeJS + Express'];

const TemplateSelect = ({ templateName, className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-placeholder')}>Please choose a template you want to use</span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option', 'active')}>{templateName}</div>
      {TEMPLATES.map((template) => (
        <div key={template} className={cx('select-option')}>
          {template}
        </div>
      ))}
    </div>
  </div>
);

export default TemplateSelect;
