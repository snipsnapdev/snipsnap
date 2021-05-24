import classNames from 'classnames/bind';
import Image from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

import Items from './items';
import styles from './marketplace.module.scss';
import Search from './search';

const cx = classNames.bind(styles);

const getMarketplaceItems = gql`
  query getAvailableTemplates {
    templates(where: { is_public: { _eq: true } }) {
      id
      name
      files
      prompts
      owner {
        id
        name
        image
      }
    }
  }
`;

const Marketplace = () => {
  const [searchText, setSearchText] = useState('');

  const gqlClient = useGqlClient();
  const fetcher = () => gqlClient.request(getMarketplaceItems);
  const { data } = useSWR('getMarketplaceTemplates', fetcher);

  const availableTemplates = data?.templates || [];

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
      <Items searchText={searchText} items={availableTemplates} />
      <div className={cx('image-wrapper')}>
        <Image
          src="/images/marketplace-illustration.png"
          alt="Marketplace"
          width={512}
          height={170}
          quality={90}
        />
      </div>
    </div>
  );
};

export default Marketplace;
