import PropTypes from 'prop-types';

import { useTemplateGroups } from 'contexts/template-groups-provider';

import TemplateGroupItem from './template-group-item';
import TemplateItem from './template-item';

const TemplatesGroupsTree = ({ className, onlyOwned, onlyShared }) => {
  const {
    groups,
    templates,
    ownedGroups,
    ownedTemplates,
    sharedGroups,
    sharedTemplates,
  } = useTemplateGroups();

  const groupsToRender = [];
  const templatesToRender = [];

  if (onlyOwned) {
    groupsToRender.push(...ownedGroups);
    templatesToRender.push(...ownedTemplates);
  } else if (onlyShared) {
    groupsToRender.push(...sharedGroups);
    templatesToRender.push(...sharedTemplates);
  } else {
    groupsToRender.push(...groups);
    templatesToRender.push(...templates);
  }

  return (
    <div className={className}>
      {groupsToRender.map((group) => (
        <TemplateGroupItem
          key={group.id}
          name={group.name}
          groupId={group.id}
          templates={group.templates}
        />
      ))}
      {templatesToRender.map((template) => (
        <TemplateItem
          key={template.id}
          name={template.name}
          templateId={template.id}
          favourite={template.favourite || false}
        />
      ))}
    </div>
  );
};

TemplatesGroupsTree.propTypes = {
  className: PropTypes.string,
  onlyOwned: PropTypes.bool,
  onlyShared: PropTypes.bool,
};

TemplatesGroupsTree.defaultProps = {
  className: null,
  onlyOwned: false,
  onlyShared: false,
};

export default TemplatesGroupsTree;
