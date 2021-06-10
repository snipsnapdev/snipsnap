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
import CursorIcon from './images/cursor.inline.svg';
import DownloadIcon from './images/download.inline.svg';
import VscodeScreen from './images/vscode.inline.svg';

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

const EmptyVscode = () => <VscodeScreen className={cx('vscode')} />;

const MenuItem = ({ name, shortcut = null, disabled = false, active = false }) => (
  <div className={cx('menu-item', disabled && 'disabled', active && 'active')}>
    <span className={cx('item-name')}>{name}</span>
    {shortcut && <span className={cx('item-shortcut')}>{shortcut}</span>}
  </div>
);
const Separator = () => <div className={cx('separator')} />;

const FolderMenu = () => (
  <div className={cx('menu')}>
    <MenuItem name="New File" />
    <MenuItem name="New Folder" />
    <MenuItem name="Reveal in Finder" shortcut="⌥⌘R" />
    <MenuItem name="Open in Integrated Terminal" />
    <Separator />
    <MenuItem name="Create from Template" active />
    <Separator />
    <MenuItem name="Add Folder to Workspace..." />
    <MenuItem name="Open Folder Settings" />
    <MenuItem name="Remove Folder from Workspace" />
    <Separator />
    <MenuItem name="Find in Folder" shortcut="⌥⇧F" />
    <Separator />
    <MenuItem name="Paste" shortcut="⌘V" disabled />
    <Separator />
    <MenuItem name="Copy Path" shortcut="⌥⌘C" />
    <MenuItem name="Copy Relative Path" shortcut="⌥⇧⌘C" />
  </div>
);

const TEMPLATES = ['Create React Component', 'Dockerfile', 'NodeJS + Express'];

const TemplateSelect = ({ className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-placeholder')}>Please choose a template you want to use</span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option', 'active')}>DEMO TEMPLATE</div>
      {TEMPLATES.map((template) => (
        <div key={template} className={cx('select-option')}>
          {template}
        </div>
      ))}
    </div>
  </div>
);

const PromptInput = ({ className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-text')}>user input</span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option')}>
        Please type component name (Press 'Enter' to confirm or 'Escape' to cancel)
      </div>
    </div>
  </div>
);

const CollectionTemplate = ({ templateId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [session = {}] = useSession();

  const { user } = session;

  const { push, asPath } = useRouter();

  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(getTemplate, { id: templateId });
  const { data } = useSWR('getTemplate', fetcher);

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

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('title')}>{template.name}</h2>
      <div className={cx('description-wrapper')}>
        <p className={cx('description')}>{template.description}</p>
        <Button
          className={cx('clone-button')}
          isLoading={isLoading}
          onClick={handleCloneButtonClick}
        >
          <DownloadIcon className={cx('download-icon')} />
          <span>{user ? 'Clone' : 'Sign Up and Clone'}</span>
        </Button>
      </div>
      <div className={cx('animation')}>
        <EmptyVscode />
        <FolderMenu />
        <TemplateSelect className={cx('template-select')} />
        <PromptInput className={cx('prompt-input')} />
      </div>
    </div>
  );
};

CollectionTemplate.propTypes = {
  collectionTemplateId: PropTypes.string.isRequired,
};

export default CollectionTemplate;
