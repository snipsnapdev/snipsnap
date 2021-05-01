import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';

import styles from './support-us.module.scss';

const GitHubButton = dynamic(import('react-github-btn'), { ssr: false });

const cx = classNames.bind(styles);

const SupportUs = () => (
  <div className={cx('wrapper')}>
    <p className={cx('text')}>
      Snipsnap is an Open Source and Free tool, we will apreciate if you give as a star
    </p>
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
);

export default SupportUs;
