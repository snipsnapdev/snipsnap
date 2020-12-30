import Sidebar from 'components/sidebar/sidebar';
import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './home.module.scss';

const cx = classNames.bind(styles);

const sidebar = {
  userName: 'Alex Barashkov',
  buttonText: 'Create template',
};

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <a href="/api/auth/signout"> Sign Out</a>
      <a href="/api/auth/signin"> Sign In</a> */}
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={cx('wrapper')}>
        <Sidebar {...sidebar} />
      </main>
    </div>
  );
}
