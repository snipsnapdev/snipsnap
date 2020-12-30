import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';

import shape1 from './images/shape-1.svg';
import shape2 from './images/shape-2.svg';
import shape3 from './images/shape-3.svg';
import shape4 from './images/shape-4.svg';
import GithubSvg from './images/github.svg';
import styles from './login.module.scss';

const cx = classNames.bind(styles);
const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;
export default function Login() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('card')}>
        <p className={cx('description')}>Welcom to</p>
        <h1 className={cx('title')}>Snipsnap - Scaffold</h1>

        <button
          className={cx('button')}
          onClick={() => signIn('github', { callbackUrl: CALLBACK_URL })}
        >
          <GithubSvg />
          login with github
        </button>
      </div>

      <img className={cx('shape', 'shape-1')} src={shape1} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-2')} src={shape2} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-3')} src={shape3} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-4')} src={shape4} loading="lazy" alt="" aria-hidden />
    </div>
  );
}
