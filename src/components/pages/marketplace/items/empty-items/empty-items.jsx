import classNames from 'classnames/bind';
import Link from 'next/link';

import styles from './empty-items.module.scss';

const cx = classNames.bind(styles);

const EmptyItems = () => (
  <div className={cx('wrapper')}>
    <div className={cx('image')} />
    <div className={cx('text')}>
      No items found.{' '}
      <Link href="/create-template">
        <a className={cx('link')}>Add new template</a>
      </Link>
    </div>
  </div>
);

export default EmptyItems;
