import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';

import styles from './empty-items.module.scss';

const cx = classNames.bind(styles);

const EmptyItems = () => (
  <div className={cx('wrapper')}>
    <div className={cx('image-wrapper')}>
      <Image
        src="/images/empty-box-illustration.png"
        alt="Empty"
        width={508}
        height={140}
        quality={90}
      />
    </div>
    <div className={cx('text')}>
      No items found.{' '}
      <Link href="/create-template">
        <a className={cx('link')}>Add new template</a>
      </Link>
    </div>
  </div>
);

export default EmptyItems;
