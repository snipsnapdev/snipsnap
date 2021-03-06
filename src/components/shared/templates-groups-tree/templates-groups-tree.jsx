import classNames from 'classnames/bind';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

import TemplateGroupItem from './template-group-item';
import TemplateItem from './template-item';
import styles from './templates-groups-tree.module.scss';

const cx = classNames.bind(styles);

const query = gql`
  query getTemplates {
    templates(where: { template_group_id: { _is_null: true } }) {
      id
      name
    }
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
  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(query);
  const { data } = useSWR('getOwnedTemplatesGroups', fetcher);
  const templates = data?.templates || [];
  const groups = data?.templates_groups || [];
  return (
    <div className={cx('wrapper')}>
      {templates.map((template) => (
        <TemplateItem key={template.id} name={template.name} templateId={template.id} />
      ))}
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
