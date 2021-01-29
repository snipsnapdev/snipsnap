import classNames from 'classnames/bind';
import { useSession } from 'next-auth/client';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, gqlClient } from 'api/graphql';
import DeleteGroupModal from 'components/shared/delete-group-modal';
import Dropdown from 'components/shared/dropdown';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import GroupSvg from 'icons/group.inline.svg';

import TemplateItem from '../template-item';

import styles from './template-group-item.module.scss';

const cx = classNames.bind(styles);

const deleteQuery = gql`
  mutation deleteTemplateGroup($id: uuid!) {
    delete_templates_groups_by_pk(id: $id) {
      name
      user_id
      id
    }
  }
`;

const renameQuery = gql`
  mutation renameTemplateGroup($id: uuid!, $newName: String!) {
    update_templates_groups_by_pk(_set: { name: $newName }, pk_columns: { id: $id }) {
      name
      user_id
      id
    }
  }
`;

const TemplateGroupItem = ({ name, groupId, templates }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ token }] = useSession();
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await gqlClient(token).request(deleteQuery, { id: groupId });
      setLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    setIsDeleteModalOpen(false);
  };

  const onRename = async (groupId, newName) => {
    try {
      setLoading(true);
      await gqlClient(token).request(renameQuery, { id: groupId, newName });
      setLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const groupMenu = (groupId) => (
    <>
      <div onClick={() => onRename(groupId, 'Renamed')}>Rename</div>
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
            menu={groupMenu(groupId)}
            // menu={groupMenu}
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
    </div>
  );
};
export default TemplateGroupItem;
