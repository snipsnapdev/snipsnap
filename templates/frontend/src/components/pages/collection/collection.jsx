import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';

import styles from './collection.module.scss';
import ReactjsLogo from './images/reactjs.inline.svg';

const cx = classNames.bind(styles);

const getCuratedTemplateGroup = gql`
  query getCuratedTemplateGroup($slug: String!) {
    curated_template_groups(where: { slug: { _eq: $slug } }) {
      name
      description
      image_name
      templates {
        id
        template {
          name
        }
      }
    }
  }
`;

const Collection = ({ collectionSlug }) => {
  const router = useRouter();

  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(getCuratedTemplateGroup, { slug: collectionSlug });
  const { data } = useSWR('getCuratedTemplateGroup', fetcher);

  const collection = data?.curated_template_groups?.[0] || null;

  if (!collection) return null;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <ReactjsLogo className={cx('image')} />
        <h2 className={cx('title')}>{collection.name}</h2>
      </div>
      <p className={cx('description')}>{collection.description}</p>
      {collection.templates.map(({ id, template: { name } }) => (
        <div
          className={cx('item')}
          key={id}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            router.push(`/collection-template/${id}`);
          }}
        >
          <span className={cx('item-name')}>{name}</span>
          <Button themeType="link" size="md">
            View
          </Button>
        </div>
      ))}
    </div>
  );
};

Collection.propTypes = {
  collectionSlug: PropTypes.string.isRequired,
};

export default Collection;
