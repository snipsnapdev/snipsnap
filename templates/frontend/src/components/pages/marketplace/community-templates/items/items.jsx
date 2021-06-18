import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Avatar from 'components/shared/avatar';
import Button from 'components/shared/button';
import useSession from 'hooks/use-session';

import EmptyItems from './empty-items';
import styles from './items.module.scss';

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

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL;

const Items = ({ searchText, items }) => {
  const filteredItems = searchText
    ? items.filter(({ name, owner }) => {
        const searchWords = searchText.toLowerCase().trim().split(' ');
        return searchWords.every(
          (searchWord) =>
            name.toLowerCase().includes(searchWord.trim()) ||
            owner.name.toLowerCase().includes(searchWord.trim())
        );
      })
    : items;

  const { push, asPath } = useRouter();

  const [session = {}] = useSession();

  const { user } = session;

  const gqlClient = useGqlClient();

  const handleClone = async ({ name, prompts, files }) => {
    const res = await gqlClient.request(cloneTemplateQuery, {
      name,
      prompts,
      files,
    });

    mutate('getOwnedTemplateGroups');

    try {
      const templateId = res?.insert_template?.id || null;

      if (templateId) {
        push(`/templates/${templateId}/edit`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {filteredItems.length === 0 && <EmptyItems />}
      {filteredItems.length > 0 && (
        <div className={cx('wrapper')}>
          {filteredItems.map(({ id, name, prompts, files, owner }) => (
            <div
              className={cx('item')}
              key={id}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                push(`/templates/${id}/preview`);
              }}
            >
              <h3 className={cx('item-name')}>{name}</h3>
              <div className={cx('item-footer')}>
                <div className={cx('item-author')}>
                  <Avatar
                    className={cx('item-author-avatar')}
                    avatar={owner.image}
                    userName={owner.name}
                  />
                  <span className={cx('item-author-name', 'no-wrap')}>{owner.name}</span>
                </div>
                <Button
                  className={cx('clone', 'no-wrap')}
                  themeType="link"
                  size="md"
                  onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (user) {
                      handleClone({ name, prompts, files });
                    } else {
                      signIn('github', { callbackUrl: `${CALLBACK_URL}${asPath}` });
                    }
                  }}
                >
                  {user ? 'Clone' : 'Sign Up and Clone'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

Items.propTypes = {
  searchText: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      prompts: PropTypes.string,
      files: PropTypes.string,
      owner: {
        name: PropTypes.string,
        image: PropTypes.string,
      },
    })
  ),
};

Items.defaultProps = {
  searchText: '',
  items: [],
};

export default Items;
