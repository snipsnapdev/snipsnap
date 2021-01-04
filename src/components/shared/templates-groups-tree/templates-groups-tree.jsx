import classNames from 'classnames/bind';

import TemplateGroupItem from './template-group-item';
import styles from './templates-groups-tree.module.scss';

const cx = classNames.bind(styles);

const GROUPS = [
  {
    id: 'c028ff21-f0ee-48c7-8d6a-83df5375f981',
    name: 'Pixel Point',
    templates: [
      {
        id: 'c028qqf21-f0ee-48c7-8d6a-83df5375f981',
        name: 'Create React Component',
      },
      {
        id: 'c128qqf21-f0ee-48c7-8d6a-83df5375f981',
        name: 'Create Kubernetes Deployment',
      },
    ],
  },
  {
    id: 'c028ff21-f0ee-48c7-9d6a-83df5375f980',
    name: 'Harness',
    templates: [
      {
        id: 'c028qqf21-f0ee-48cg-8d6a-83df5375f981',
        name: 'Create Utils',
      },
      {
        id: 'c128qqf21-f0qe-48c7-8d6a-83df5375f981',
        name: 'Create Helper',
      },
    ],
  },
];
const TemplatesGroupsTree = () => (
  <div className={cx('wrapper')}>
    {GROUPS.map((group) => (
      <TemplateGroupItem
        key={group.id}
        name={group.name}
        groupId={group.id}
        templates={group.templates}
      />
    ))}
  </div>
);

export default TemplatesGroupsTree;
