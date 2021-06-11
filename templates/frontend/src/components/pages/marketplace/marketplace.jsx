import classNames from 'classnames/bind';
import Image from 'next/image';

import CommunityTemplates from './community-templates';
import CuratedCollections from './curated-collections';
import styles from './marketplace.module.scss';

const cx = classNames.bind(styles);

const Marketplace = () => (
  <div className={cx('wrapper')}>
    <div className={cx('header')}>
      <h2 className={cx('title')}>Marketplace</h2>
      <p className={cx('description')}>
        Find templates created by other users. Clone them and modify for your needs. Share your
        templates with the community.
      </p>
    </div>
    <CuratedCollections />
    <CommunityTemplates />
    <div className={cx('image-wrapper')}>
      <Image
        src="/images/marketplace-illustration.png"
        alt="Marketplace"
        width={512}
        height={170}
        quality={90}
      />
    </div>
  </div>
);

export default Marketplace;
