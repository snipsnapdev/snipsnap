import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';

import styles from './collection-template.module.scss';
import DownloadIcon from './images/download.inline.svg';

const cx = classNames.bind(styles);

const cloneTemplateQuery = gql`
  mutation createTemplate($name: String!, $prompts: String, $files: String!) {
    insert_template(object: { name: $name, files: $files, prompts: $prompts }) {
      id
      name
      prompts
      files
      owner_id
    }
  }
`;

const CollectionTemplate = ({ collectionTemplateId }) => {
  const router = useRouter();

  const gqlClient = useGqlClient();

  const handleCloneButtonClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const res = await gqlClient.request(cloneTemplateQuery, {
      // TODO: Pass name, prompts and files here
      // name,
      // prompts,
      // files,
    });

    mutate('getOwnedTemplateGroups');

    try {
      const templateId = res?.insert_template?.id || null;

      if (templateId) {
        router.push(`/template/${templateId}/edit`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>React Class Component (Folder + JSX + CSS)</h2>
      <div className={cx('description-wrapper')}>
        <p className={cx('description')}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis duis mauris elementum,
          sollicitudin. Eros suscipit sed integer viverra id vitae pellentesque tincidunt mollis.
          Lectus id pulvinar condimentum nunc.
        </p>
        <Button className={cx('clone-button')} onClick={handleCloneButtonClick}>
          <DownloadIcon />
          <span>Clone and start use</span>
        </Button>
      </div>
    </div>
  );
};

CollectionTemplate.propTypes = {
  collectionTemplateId: PropTypes.string.isRequired,
};

export default CollectionTemplate;
