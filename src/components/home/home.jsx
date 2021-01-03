import classNames from 'classnames/bind';
import Head from 'next/head';

import Input from 'components/shared/input';

import styles from './home.module.scss';

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
