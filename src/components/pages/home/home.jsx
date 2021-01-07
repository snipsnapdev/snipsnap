import classNames from 'classnames/bind';

import Input from 'components/shared/input';

import styles from './home.module.scss';

const cx = classNames.bind(styles);

export default function Home() {
  return <div className={styles.container} />;
}
