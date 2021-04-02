import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';

import DeleteTemplateModal from 'components/shared/delete-template-modal';
import Dropdown from 'components/shared/dropdown';
import ShareModal from 'components/shared/share-modal';
import CloseSvg from 'icons/close.inline.svg';
import DotsSvg from 'icons/dots-menu.inline.svg';
import TemplateSvg from 'icons/template.inline.svg';

import styles from './template-item.module.scss';

const cx = classNames.bind(styles);

const TemplateItem = ({ name, templateId, nested }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const templateMenu = (
    <>
      <div onClick={() => setIsShareModalOpen(true)}>Share</div>
      <div onClick={() => setIsDeleteModalOpen(true)}>Delete</div>
    </>
  );

  return (
    <Link href={`/template/${templateId}`}>
      <div className={cx('wrapper', { nested })}>
        <TemplateSvg className={cx('icon')} />
        <span className={cx('name')}>{name}</span>
        <div className={cx('options')}>
          <Dropdown
            menu={templateMenu}
            className={cx('options-inner')}
            position="top-right"
            stopPropagation
          >
            <DotsSvg className={cx('options-icon')} />
          </Dropdown>
        </div>
        {/* <div className={cx('delete-icon')} onClick={() => setIsDeleteModalOpen(true)}>
          <CloseSvg />
        </div> */}
        {isDeleteModalOpen && (
          <DeleteTemplateModal
            id={templateId}
            name={name}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
        {isShareModalOpen && (
          <ShareModal
            id={templateId}
            type="template"
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}
      </div>
    </Link>
  );
};

TemplateItem.defaultProps = {
  nested: false,
};

export default TemplateItem;
