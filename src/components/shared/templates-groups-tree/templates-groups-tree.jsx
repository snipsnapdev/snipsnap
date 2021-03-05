import classNames from 'classnames/bind';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import { useToken, isExpired, fetchToken } from 'hooks/use-token';

import TemplateGroupItem from './template-group-item';
import styles from './templates-groups-tree.module.scss';

const cx = classNames.bind(styles);

const query = gql`
  query getOwnedTemplatesGroups {
    templates_groups {
      id
      name
      templates {
        name
        id
      }
    }
  }
`;

const TemplatesGroupsTree = () => {
  const { token } = useToken();

  const gqlClient = useGqlClient();

  const fetcher = (key, token) => 
    // if (isExpired(token)) return;
     gqlClient.request(query)
  ;

  const { data } = useSWR('getOwnedTemplatesGroups', fetcher);

  const groups = data?.templates_groups || [];
  return (
    <div className={cx('wrapper')}>
      {groups.map((group) => (
        <TemplateGroupItem
          key={group.id}
          name={group.name}
          groupId={group.id}
          templates={group.templates}
        />
      ))}
    </div>
  );
};

export default TemplatesGroupsTree;
