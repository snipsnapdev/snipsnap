import classNames from 'classnames/bind';

import { useTemplateGroups } from 'contexts/template-groups-provider';

import TemplateGroupItem from './template-group-item';
import styles from './templates-groups-tree.module.scss';

const cx = classNames.bind(styles);

const TemplatesGroupsTree = () => {
  const groups = useTemplateGroups();

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
