import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Button from 'components/shared/button';
import Sidebar from 'components/shared/sidebar';
import useSession from 'hooks/use-session';

import styles from './layout.module.scss';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});

const cx = classNames.bind(styles);

const Layout = ({ children }) => {
  const [session = {}] = useSession();

  const { user } = session;

  return (
    <div className={cx('wrapper')}>
      <Head>
        <meta name="viewport" content="width=1280, initial-scale=1.0" />
      </Head>
      <Sidebar />
      <div className={cx('main', { unauthorised: !user })}>{children}</div>

      {/* This component was left in HOC Layout to make work properly with modals
    https://github.com/wwayne/react-tooltip */}
      <ReactTooltip
        className={cx('tooltip')}
        effect="solid"
        place="right"
        delayHide={500}
        id="tooltip-modal"
        clickable
      >
        <p>
          Publicly available templates are visible in the marketplace, so others could use it as it
          is or clone it.
        </p>
        <Button tag="a" target="_blank" href="https://github.com/snipsnapdev" themeType="link">
          Learn more
        </Button>
      </ReactTooltip>
    </div>
  );
};

export default Layout;
