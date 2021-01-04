import classNames from 'classnames/bind';
import { useState } from 'react';

import Dropdown from 'components/shared/dropdown';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import GroupSvg from 'icons/group.inline.svg';

import TemplateItem from '../template-item';

import styles from './template-group-item.module.scss';

const cx = classNames.bind(styles);

const TemplateGroupItem = ({ name, groupId, templates }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const groupMenu = (
    <>
      <a href="#">Edit</a>
      <a href="#">Delete</a>
    </>
  );

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cx('container', { expanded: isExpanded })}>
      <div className={cx('group-wrapper')} onClick={handleExpand}>
        <div className={cx('icon-wrapper')}>
          <GroupSvg className={cx('icon')} />
        </div>
        <span className={cx('name')}>{name}</span>
        <ArrowSvg className={cx('arrow')} />
        <div className={cx('options')}>
          <Dropdown
            menu={groupMenu}
            className={cx('options-inner')}
            position="top-right"
            stopPropagation
          >
            <DotsSvg className={cx('options-icon')} />
          </Dropdown>
        </div>
      </div>
      <div className={cx('templates')}>
        {templates.length > 0 &&
          templates.map((template) => (
            <TemplateItem key={template.id} name={template.name} templateId={template.id} />
          ))}
      </div>
    </div>
  );
};
export default TemplateGroupItem;
