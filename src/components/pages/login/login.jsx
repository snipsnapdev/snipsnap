import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import Link from 'next/link';
import { useState } from 'react';

import Button from 'components/shared/new-button';
import SupportUs from 'components/shared/support-us';
import UseCases from 'components/shared/use-cases';

import GithubLogo from './images/github.inline.svg';
import Logo from './images/logo.inline.svg';
import styles from './login.module.scss';

const cx = classNames.bind(styles);

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left')}>
        <Logo className={cx('logo')} />
        <h1 className={cx('title')}>Snipsnap</h1>
        <p className={cx('description')}>
          Create, manage, share and use code templates with cloud UI and VS Code Extension
        </p>
        <Button
          className={cx('button')}
          themeColor="white"
          size="md"
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            signIn('github', { callbackUrl: CALLBACK_URL });
          }}
        >
          <GithubLogo /> Login with GitHub
        </Button>
        <h2 className={cx('subtitle')}>Let Snipsnap 🚀 power you!</h2>
        <ul className={cx('features')}>
          <li className={cx('features-item')}>
            <span>Reduce number of mistakes during copy-pasting boilerplate code.</span>
          </li>
          <li className={cx('features-item')}>
            <span>
              Speed up your development by creating highly flexible Handlebars powered code
              templates
            </span>
          </li>
        </ul>

        <ul className={cx('links-wrapper')}>
          <li>
            <Link href="/">
              <Button tag="a" themeType="link" size="md">
                Guides
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/">
              <Button tag="a" themeType="link" size="md">
                Install VS Code Extension
              </Button>
            </Link>
          </li>
        </ul>
      </div>

      <div className={cx('right')}>
        <SupportUs />
        <UseCases />
      </div>
    </div>
  );
}
