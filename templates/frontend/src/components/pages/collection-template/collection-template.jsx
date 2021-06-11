import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import useSession from 'hooks/use-session';

import styles from './collection-template.module.scss';
import DownloadIcon from './images/download.inline.svg';
import VscodeAnimation from './vscode-animation';

const cx = classNames.bind(styles);

const getTemplate = gql`
  query getTemplate($id: uuid!) {
    templates(where: { id: { _eq: $id } }) {
      name
      description
      prompts
      files
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

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;

const CollectionTemplate = ({ templateId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [session = {}] = useSession();

  const { user } = session;

  const { push, asPath } = useRouter();

  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(getTemplate, { id: templateId });
  const { data } = useSWR(`getTemplate/${templateId}`, fetcher);

  const template = data?.templates?.[0] || null;

  const handleCloneButtonClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (user) {
      const res = await gqlClient.request(cloneTemplateQuery, {
        name: template.name,
        prompts: template.prompts,
        files: template.files,
      });

      mutate('getOwnedTemplateGroups');

      try {
        const templateId = res?.insert_template?.id || null;

        if (templateId) {
          push(`/template/${templateId}/edit`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsLoading(true);
      signIn('github', { callbackUrl: `${CALLBACK_URL}${asPath}` });
    }
  };

  if (!template) return null;

  const DownloadButton = () => (
    <Button className={cx('clone-button')} isLoading={isLoading} onClick={handleCloneButtonClick}>
      <DownloadIcon className={cx('download-icon')} />
      <span>{user ? 'Clone' : 'Sign Up and Clone'}</span>
    </Button>
  );

  return (
    <div className={cx('wrapper')}>
      {!template.description && (
        <div className={cx('title-wrapper')}>
          <h2 className={cx('title')}>{template.name}</h2>
          <DownloadButton />
        </div>
      )}
      {template.description && (
        <>
          <h2 className={cx('title')}>{template.name}</h2>
          <div className={cx('description-wrapper')}>
            <p className={cx('description')}>{template.description}</p>
            <DownloadButton />
          </div>
        </>
      )}
      <VscodeAnimation template={template} />
    </div>
  );
};

// CollectionTemplate.propTypes = {
//   collectionTemplateId: PropTypes.string.isRequired,
// };

export default CollectionTemplate;
