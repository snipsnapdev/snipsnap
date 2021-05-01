import classNames from 'classnames/bind';
import { useState } from 'react';

import Items from './items';
import styles from './marketplace.module.scss';
import Search from './search';

const cx = classNames.bind(styles);

const Marketplace = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h2 className={cx('title')}>Marketplace</h2>
        <p className={cx('description')}>
          Create or use existing templates for your deployments, pods, certificates. Reduce changes
          of failures copypasting yaml files from previous project
        </p>
      </div>
      <Search value={searchText} onChange={setSearchText} />
      <Items searchText={searchText} />
    </div>
  );
};

export default Marketplace;
