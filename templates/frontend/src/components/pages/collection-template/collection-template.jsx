import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import useSWR, { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';

import styles from './collection-template.module.scss';
import DownloadIcon from './images/download.inline.svg';

const cx = classNames.bind(styles);

const getCuratedTemplate = gql`
  query getCuratedTemplate($id: uuid!) {
    curated_templates(where: { id: { _eq: $id } }) {
      id
      template {
        name
        description
        prompts
        files
      }
    }
  }
`;

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

  const fetcher = () => gqlClient.request(getCuratedTemplate, { id: collectionTemplateId });
  const { data } = useSWR('getCuratedTemplate', fetcher);

  console.log(data);

  const collectionTemplate = data?.curated_templates?.[0] || null;

  const handleCloneButtonClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const res = await gqlClient.request(cloneTemplateQuery, {
      name: collectionTemplate.template.name,
      prompts: collectionTemplate.template.prompts,
      files: collectionTemplate.template.files,
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

  if (!collectionTemplate) return null;

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>{collectionTemplate.template.name}</h2>
      <div className={cx('description-wrapper')}>
        <p className={cx('description')}>{collectionTemplate.template.description}</p>
        <Button className={cx('clone-button')} onClick={handleCloneButtonClick}>
          <DownloadIcon />
          <span>Clone</span>
        </Button>
      </div>
    </div>
  );
};

CollectionTemplate.propTypes = {
  collectionTemplateId: PropTypes.string.isRequired,
};

export default CollectionTemplate;
