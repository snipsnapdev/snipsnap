import classNames from 'classnames/bind';

import TemplateSvg from 'icons/template.inline.svg';

import styles from './template-item.module.scss';

const cx = classNames.bind(styles);

const TemplateItem = ({ name }) => (
  <div className={cx('wrapper')}>
    <TemplateSvg className={cx('icon')} />
    <span className={cx('name')}>{name}</span>
    <div className={cx('options')} />
  </div>
);

export default TemplateItem;
