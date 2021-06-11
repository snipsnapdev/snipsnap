import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import Button from 'components/shared/button';
import SupportUs from 'components/shared/support-us';
import UseCases from 'components/shared/use-cases';

import GithubLogo from './images/github.inline.svg';
import LogoText from './images/logo-text.inline.svg';
import PlayIcon from './images/play.inline.svg';
import styles from './login.module.scss';

const cx = classNames.bind(styles);

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left')}>
        <div className={cx('logo-wrapper')}>
          <Image src="/logo-white.png" alt="Snipsnap Logo" width={80} height={80} quality={90} />
        </div>
        <LogoText className={cx('title')} />
        <p className={cx('description')}>
          Manage, share and use code templates with cloud UI and VS Code Extension
        </p>
        <div className={cx('actions')}>
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
          <Button
            className={cx('button', 'how-to')}
            themeColor="custom"
            size="md"
            tag="a"
            target="_blank"
            rel="noopener noreferer"
            href="https://www.youtube.com/watch?v=G7J_rWiMzwE"
          >
            <PlayIcon /> How it works
          </Button>
        </div>
        <h2 className={cx('subtitle')}>
          Let Snipsnap <span>💪</span> power you!
        </h2>
        <ul className={cx('features')}>
          <li className={cx('features-item')}>
            <span>Reduce number of mistakes when copy-pasting boilerplate code.</span>
          </li>
          <li className={cx('features-item')}>
            <span>
              Speed up your development with highly flexible Handlebars powered code templates
            </span>
          </li>
        </ul>

        <ul className={cx('links-wrapper')}>
          <li>
            <Button
              tag="a"
              themeType="link"
              size="md"
              target="_blank"
              href="https://github.com/snipsnapdev/snipsnap/tree/master/templates"
            >
              Docs
            </Button>
          </li>
          <li>
            <Button
              tag="a"
              themeType="link"
              size="md"
              target="_blank"
              href="https://github.com/snipsnapdev/snipsnap/issues"
            >
              Report an issue
            </Button>
          </li>
          <li>
            <Button href="mailto:info@snipsnap.dev" tag="a" themeType="link" size="md">
              Contact Us
            </Button>
          </li>
          <li>
            <Button tag="a" themeType="link" size="md" href="/marketplace">
              Marketplace
            </Button>
          </li>
        </ul>
      </div>

      <div className={cx('right')}>
        <SupportUs />
        <video
          title="Snipsnap demo"
          className={cx('demo')}
          type="video/mp4"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/demo.mp4" />
        </video>

        <UseCases />
      </div>
    </div>
  );
}
