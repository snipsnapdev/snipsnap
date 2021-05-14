import classNames from 'classnames/bind';
import Link from 'next/link';
import PropTypes from 'prop-types';
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

const TemplateGroupItem = ({
  name,
  groupId,
  templates,
  isOpen = false,
  disableSharing = false,
  onOpen,
  onClose,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const menuItems = [
    {
      text: 'Create template',
      tagName: 'Link',
      href: `/create-template?groupId=${groupId}`,
    },
    ...(disableSharing
      ? []
      : [
          {
            text: 'Share',
            onClick: () => setIsShareModalOpen(true),
          },
        ]),
    {
      text: 'Rename',
      onClick: () => setIsRenameModalOpen(true),
    },
    {
      text: 'Delete',
      onClick: () => setIsDeleteModalOpen(true),
      theme: 'danger',
    },
  ];

  const handleExpand = () => {
    if (isOpen) {
      onClose(groupId);
    } else {
      onOpen(groupId);
    }
  };

  return (
    <div className={cx('container', { expanded: isOpen })}>
      <div className={cx('group-wrapper')} onClick={handleExpand}>
        <div className={cx('icon-wrapper')}>
          <ArrowIcon className={cx('icon', isOpen && 'expanded')} />
        </div>
        <span className={cx('name')}>{name}</span>
        <Dropdown
          menuItems={menuItems}
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

TemplateGroupItem.propTypes = {
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      templateId: PropTypes.string.isRequired,
      favourite: PropTypes.bool,
      disableSharing: PropTypes.bool,
    })
  ),
  isOpen: PropTypes.bool,
  disableSharing: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

TemplateGroupItem.defaultProps = {
  templates: [],
  isOpen: false,
  disableSharing: false,
  onOpen: undefined,
  onClose: undefined,
};

export default TemplateGroupItem;
