import classNames from 'classnames/bind';
import { useSession } from 'next-auth/client';
import { useState } from 'react';
import { mutate } from 'swr';

import { gql, gqlClient } from 'api/graphql';
import Dropdown from 'components/shared/dropdown';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import GroupSvg from 'icons/group.inline.svg';

import TemplateItem from '../template-item';

import styles from './template-group-item.module.scss';

const cx = classNames.bind(styles);

const query = gql`
  mutation deleteTemplateGroup($id: uuid!) {
    delete_templates_groups_by_pk(id: $id) {
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

  const onDelete = async (groupId) => {
    try {
      setLoading(true);
      await gqlClient(token).request(query, { id: groupId });
      setLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const groupMenu = (groupId) => (
      <>
        <a href="#">Edit</a>
        {/* <a href="#">Delete</a> */}
        <div onClick={() => onDelete(groupId)}>Delete</div>
      </>
    );

  // const groupMenu = (
  //   <>
  //     <a href="#">Edit</a>
  //     <a href="#">Delete</a>
  //   </>
  // );

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
    </div>
  );
};
export default TemplateGroupItem;
