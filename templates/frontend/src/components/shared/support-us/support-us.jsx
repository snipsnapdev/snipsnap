import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import styles from './support-us.module.scss';

const GitHubButton = dynamic(import('react-github-btn'), { ssr: false });

const cx = classNames.bind(styles);

const SupportUs = () => (
  <div className={cx('wrapper')}>
    <p className={cx('text')}>
      Snipsnap is an Open Source and free, we will appreciate if you give us a star
    </p>
    <div className={cx('github-button')}>
      <GitHubButton
        href="https://github.com/snipsnapdev/snipsnap"
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star snipsnapdev/snipsnap on GitHub"
      >
        Star
      </GitHubButton>
    </div>
    <div className={cx('image-wrapper')}>
      <Image
        src="/images/github-illustration.png"
        alt="Support us on Github"
        width={560}
        height={140}
        quality={90}
      />
    </div>
  </div>
);

export default SupportUs;
