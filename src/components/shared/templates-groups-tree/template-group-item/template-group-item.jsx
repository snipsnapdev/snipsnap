import classNames from 'classnames/bind';
import { useState } from 'react';

import DeleteGroupModal from 'components/shared/delete-group-modal';
import Dropdown from 'components/shared/dropdown';
import RenameGroupModal from 'components/shared/rename-group-modal';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import GroupSvg from 'icons/group.inline.svg';

import TemplateItem from '../template-item';

import styles from './template-group-item.module.scss';

const cx = classNames.bind(styles);

const TemplateGroupItem = ({ name, groupId, templates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const groupMenu = (
    <>
      <div onClick={() => setIsRenameModalOpen(true)}>Rename</div>
      <div onClick={() => setIsDeleteModalOpen(true)}>Delete</div>
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
        {templates.length > 0 && <ArrowSvg className={cx('arrow')} />}
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
      {isDeleteModalOpen && (
        <DeleteGroupModal
          id={groupId}
          name={name}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isRenameModalOpen && (
        <RenameGroupModal
          id={groupId}
          name={name}
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
        />
      )}
    </div>
  );
};
export default TemplateGroupItem;
