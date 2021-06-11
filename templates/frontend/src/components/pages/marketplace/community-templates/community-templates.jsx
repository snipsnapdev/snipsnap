import classNames from 'classnames/bind';
import { useState } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

import styles from './community-templates.module.scss';
import Items from './items';
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

const CommunityTemplates = () => {
  const [searchText, setSearchText] = useState('');

  const gqlClient = useGqlClient();
  const fetcher = () => gqlClient.request(getMarketplaceItems);
  const { data } = useSWR('getMarketplaceTemplates', fetcher);

  const availableTemplates = data?.templates || [];

  return (
    <div>
      <h3 className={cx('title')}>
        <img width={30} src="/images/peace.png" alt="" aria-hidden />
        <span>Community templates</span>
      </h3>
      <Search value={searchText} onChange={setSearchText} />
      <Items searchText={searchText} items={availableTemplates} />
    </div>
  );
};

export default CommunityTemplates;
