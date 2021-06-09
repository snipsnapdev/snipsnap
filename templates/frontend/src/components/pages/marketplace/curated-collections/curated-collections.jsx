import classNames from 'classnames/bind';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

import styles from './curated-collections.module.scss';
import Items from './items';

const cx = classNames.bind(styles);

const getCuratedTemplateGroups = gql`
  query getAvailableTemplates {
    curated_template_groups {
      id
      name
      description
      image_name
      slug
      templates {
        id
      }
    }
  }
`;

const CuratedCollections = () => {
  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(getCuratedTemplateGroups);
  const { data, error } = useSWR('getCuratedTemplateGroups', fetcher);

  const items = data?.curated_template_groups || [];

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('title')}>
        <img width={30} src="/images/rock.png" alt="" aria-hidden />
        <span>Curated collections</span>
      </h3>
      <Items items={items} />
    </div>
  );
};

export default CuratedCollections;
