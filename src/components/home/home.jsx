import Head from 'next/head';
import classNames from 'classnames/bind';
import styles from './home.module.scss';

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={cx('wrapper')}>{/* <Sidebar {...sidebar} /> */}</main>
    </div>
  );
}
