import classNames from 'classnames/bind';

import { useOpenGroups } from 'contexts/open-groups-context';
import { useTemplateGroups } from 'contexts/template-groups-provider';

import TemplateGroupItem from './template-group-item';
import TemplateItem from './template-item/template-item';
import styles from './templates-groups-tree.module.scss';

const cx = classNames.bind(styles);

const TemplatesGroupsTree = () => {
  const { ownedGroups, ownedTemplates, sharedGroups, sharedTemplates } = useTemplateGroups();
  const { openGroups, openGroup, closeGroup } = useOpenGroups();

  const renderOwned = ownedGroups.length > 0 || ownedTemplates.length > 0;
  const renderShared = sharedGroups.length > 0 || sharedTemplates.length > 0;

  return (
    <div className={cx('wrapper')}>
      {renderOwned && (
        <div className={cx('section')}>
          <h3 className={cx('subtitle')}>My templates</h3>
          {ownedGroups.map((group) => (
            <TemplateGroupItem
              key={group.id}
              name={group.name}
              groupId={group.id}
              templates={group.templates}
              isOpen={openGroups.includes(group.id)}
              onOpen={openGroup}
              onClose={closeGroup}
            />
          ))}
          {ownedTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              name={template.name}
              templateId={template.id}
              favourite={template.favourite || false}
            />
          ))}
        </div>
      )}
      {renderShared && (
        <div className={cx('section')}>
          <h3 className={cx('subtitle')}>Shared with me templates</h3>
          {sharedGroups.map((group) => (
            <TemplateGroupItem
              key={group.id}
              name={group.name}
              groupId={group.id}
              templates={group.templates}
              isOpen={openGroups.includes(group.id)}
              shared
              onOpen={openGroup}
              onClose={closeGroup}
            />
          ))}
          {sharedTemplates.map((template) => (
            <TemplateItem
              key={template.id}
              name={template.name}
              templateId={template.id}
              favourite={template.favourite || false}
              shared
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesGroupsTree;
