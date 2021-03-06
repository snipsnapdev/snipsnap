import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';

import { useGqlClient, gql } from 'api/graphql';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import useSession from 'hooks/use-session';

import styles from './steps.module.scss';

const updateAPIKey = gql`
  mutation updateApi($userId: String!) {
    refresh_api_token(object: { user_id: $userId }) {
      api_key
    }
  }
`;

const getAPIKey = gql`
  query GetToken($userId: uuid!) {
    api_keys(where: { user_id: { _eq: $userId } }) {
      api_key
    }
  }
`;

const cx = classNames.bind(styles);

const formatApiKey = (apiKey) => `${apiKey.slice(0, 15)}...${apiKey.slice(apiKey.length - 15)}`;

const Steps = () => {
  const [session] = useSession();
  const {
    user: { id: currentUserId },
  } = session;

  const gqlClient = useGqlClient();

  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const fetchApiKey = async () => {
      try {
        const res = await gqlClient.request(getAPIKey, { userId: currentUserId });
        setApiKey(res?.api_keys?.[0]?.api_key || '');
      } catch (error) {
        console.error('Fetching api key failed', error);
      }
    };

    fetchApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const handleRefresh = async () => {
    try {
      const res = await gqlClient.request(updateAPIKey, { userId: currentUserId });
      const newKey = res?.refresh_api_token?.api_key || null;
      setApiKey(newKey);
    } catch (error) {
      console.error('Refresh api key failed', error);
    }
  };

  const [{ error }, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopyButtonClick = () => {
    copyToClipboard(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <h2 className={cx('title')}>Get started with Snipsnap!</h2>
      <ul>
        <li className={cx('item')}>
          <h3 className={cx('item-title')}>Install VS Code extension</h3>
          <Button tag="a" href="vscode:extension/snipsnapdev.snipsnap-templates-vscode">
            Install extension
          </Button>
        </li>
        <li className={cx('item')}>
          <h3 className={cx('item-title')}>Add API token to Extension settings</h3>
          <Input
            className={cx('item-input')}
            value={formatApiKey(apiKey)}
            readOnly
            onClick={handleCopyButtonClick}
          />
          <div className={cx('item-footer', 'end')}>
            <Button type="button" themeType="link" onClick={handleCopyButtonClick}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button type="button" themeType="link" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
          {error && <p className={cx('error')}>{error.message}</p>}
        </li>
        <li className={cx('item')}>
          <h3 className={cx('item-title')}>Create first template</h3>
          <div className={cx('item-footer')}>
            <Link href="/create-template">
              <Button tag="a">Create template</Button>
            </Link>
            <Link href="/marketplace">
              <Button tag="a" themeType="link" size="md">
                or check our Marketplace
              </Button>
            </Link>
          </div>
        </li>
        <li className={cx('item')}>
          <h3 className={cx('item-title')}>Useful links</h3>
          <ul className={cx('item-list')}>
            <li className={cx('item-list-item')}>
              <Button
                tag="a"
                themeType="link"
                size="md"
                target="_blank"
                href="https://github.com/snipsnapdev/snipsnap/tree/master/templates"
              >
                Docs
              </Button>
            </li>
            <li className={cx('item-list-item')}>
              <Button
                tag="a"
                themeType="link"
                size="md"
                target="_blank"
                href="https://github.com/snipsnapdev/snipsnap/issues"
              >
                Report an issue
              </Button>
            </li>
            <li className={cx('item-list-item')}>
              <Button href="mailto:info@snipsnap.dev" tag="a" themeType="link" size="md">
                Contact Us
              </Button>
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
};

export default Steps;
