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

const images = {
  reactjs: ReactjsLogo,
};

const getCuratedTemplateGroup = gql`
  query getCuratedTemplateGroup($slug: String!) {
    curated_template_groups(where: { slug: { _eq: $slug } }) {
      name
      description
      image_name
      templates {
        id
        template {
          id
          name
        }
      }
    }
  }
`;

const Collection = ({ collectionSlug }) => {
  const { push } = useRouter();

  const gqlClient = useGqlClient();

  const fetcher = () => gqlClient.request(getCuratedTemplateGroup, { slug: collectionSlug });
  const { data } = useSWR('getCuratedTemplateGroup', fetcher);

  const collection = data?.curated_template_groups?.[0] || null;

  if (!collection) return null;

  const Image = images[collection.image_name];

  const {templates} = collection;
  templates.sort((t1, t2) => (t1.template.name > t2.template.name ? 1 : -1));

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <Image className={cx('image')} />
        <h2 className={cx('title')}>{collection.name}</h2>
      </div>
      <p className={cx('description')}>{collection.description}</p>
      {templates.map(({ template: { name, id } }) => (
        <div
          className={cx('item')}
          key={id}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            push(`/templates/${id}/preview`);
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
