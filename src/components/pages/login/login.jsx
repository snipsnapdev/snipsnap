import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import Link from 'next/link';
import { useState } from 'react';

import VideoPlayer from 'components/pages/login/video-player';
import Button from 'components/shared/button';
import SupportUs from 'components/shared/support-us';

import GithubLogo from './images/github.inline.svg';
import LogoText from './images/logo-text.inline.svg';
import Logo from './images/logo.inline.svg';
import styles from './login.module.scss';

const cx = classNames.bind(styles);

const useCases = [
  { title: 'Kubernetes', url: '/' },
  { title: 'Docker', url: '/' },
  { title: 'React', url: '/' },
  { title: 'Angular', url: '/' },
  { title: 'Vue', url: '/' },
  { title: 'Kubernetes', url: '/' },
  { title: 'Docker', url: '/' },
  { title: 'React', url: '/' },
  { title: 'Angular', url: '/' },
  { title: 'Vue', url: '/' },
  { title: 'Kubernetes', url: '/' },
  { title: 'Docker', url: '/' },
  { title: 'React', url: '/' },
  { title: 'Angular', url: '/' },
  { title: 'Vue', url: '/' },
];

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left')}>
        <Logo className={cx('logo')} />
        <LogoText className={cx('title')} />
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
        <VideoPlayer videoSrc="https://www.youtube.com/embed/aKKQdn26QJc" className={cx('video')} />

        <div>
          <h2 className={cx('cases-title')}>Use cases</h2>
          <ul className={cx('cases-links')}>
            {useCases.map(({ title, url }, index) => (
              <li key={index}>
                <Link href={url}>
                  <Button tag="a" themeType="link" size="md">
                    With {title}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
