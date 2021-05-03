import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';

import DeleteGroupModal from 'components/shared/delete-group-modal';
import Dropdown from 'components/shared/dropdown';
import RenameGroupModal from 'components/shared/rename-group-modal';
import ShareModal from 'components/shared/share-modal';
import ArrowIcon from 'icons/arrow.inline.svg';
import DotsIcon from 'icons/dots.inline.svg';

import TemplateItem from '../template-item';

import styles from './template-group-item.module.scss';

const cx = classNames.bind(styles);

const TemplateGroupItem = ({ name, groupId, templates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const groupMenu = (
    <>
      <Link href={`/create-template?groupId=${groupId}`}>Create template</Link>
      <div onClick={() => setIsShareModalOpen(true)}>Share</div>
      <div onClick={() => setIsRenameModalOpen(true)}>Rename</div>
      <div style={{ color: '#FF6666' }} onClick={() => setIsDeleteModalOpen(true)}>
        Delete
      </div>
    </>
  );

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cx('container', { expanded: isExpanded })}>
      <div className={cx('group-wrapper')} onClick={handleExpand}>
        <div className={cx('icon-wrapper')}>
          <ArrowIcon className={cx('icon', isExpanded && 'expanded')} />
        </div>
        <span className={cx('name')}>{name}</span>
        <Dropdown
          menu={groupMenu}
          menuClassName={cx('menu')}
          className={cx('options')}
          position="top-right"
          stopPropagation
        >
          <DotsIcon className={cx('options-icon')} />
        </Dropdown>
      </div>
      <div className={cx('templates')}>
        {templates?.length > 0 ? (
          <>
            {templates.map((template) => (
              <TemplateItem
                key={template.id}
                name={template.name}
                templateId={template.id}
                favourite={template.favourite || false}
              />
            ))}
          </>
        ) : (
          <p className={cx('no-templates-text')}>
            You don’t have any templates in this group.{' '}
            <Link href={`/create-template?groupId=${groupId}`}>
              <a>Create first.</a>
            </Link>
          </p>
        )}
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
      {isShareModalOpen && (
        <ShareModal
          id={groupId}
          type="group"
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
export default TemplateGroupItem;
