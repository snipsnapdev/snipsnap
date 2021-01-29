import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import { useState } from 'react';

import Button from 'components/shared/button';

import GithubSvg from './images/github.inline.svg';
import shape1 from './images/shape-1.url.svg';
import shape2 from './images/shape-2.url.svg';
import shape3 from './images/shape-3.url.svg';
import shape4 from './images/shape-4.url.svg';
import styles from './login.module.scss';

const cx = classNames.bind(styles);
const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;
export default function Login() {
  const [loading, setLoading] = useState(false);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('card')}>
        <p className={cx('description')}>Welcom to</p>
        <h1 className={cx('title')}>Snipsnap - Scaffold</h1>
        <Button
          className={cx('button')}
          theme="primary"
          loading={loading}
          size="lg"
          icon={GithubSvg}
          onClick={() => {
            setLoading(true);
            signIn('github', { callbackUrl: CALLBACK_URL });
          }}
        >
          login with github
        </Button>
      </div>

      <img className={cx('shape', 'shape-1')} src={shape1} alt="" aria-hidden />
      <img className={cx('shape', 'shape-2')} src={shape2} alt="" aria-hidden />
      <img className={cx('shape', 'shape-3')} src={shape3} alt="" aria-hidden />
      <img className={cx('shape', 'shape-4')} src={shape4} alt="" aria-hidden />
    </div>
  );
}
