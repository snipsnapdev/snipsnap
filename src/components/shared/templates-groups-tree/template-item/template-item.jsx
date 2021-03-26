import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';

import DeleteTemplateModal from 'components/shared/delete-template-modal';
import CloseSvg from 'icons/close.inline.svg';
import TemplateSvg from 'icons/template.inline.svg';

import styles from './template-item.module.scss';

const cx = classNames.bind(styles);

const TemplateItem = ({ name, templateId, nested }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <Link href={`/template/${templateId}`}>
      <div className={cx('wrapper', { nested })}>
        <TemplateSvg className={cx('icon')} />
        <span className={cx('name')}>{name}</span>
        <div className={cx('delete-icon')} onClick={() => setIsDeleteModalOpen(true)}>
          <CloseSvg />
        </div>
        {isDeleteModalOpen && (
          <DeleteTemplateModal
            id={templateId}
            name={name}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
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
