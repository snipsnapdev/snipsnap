import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';


import styles from './collection.module.scss';
import ReactjsLogo from './images/reactjs.inline.svg';


const cx = classNames.bind(styles);

const items = [
  {
    id: '0',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '1',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '2',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '3',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '4',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '5',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
  {
    id: '6',
    name: 'React Class Component (Folder + JSX + CSS + index.js)',
  },
];

const Collection = ({ collectionId }) => {
  const router = useRouter();

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <ReactjsLogo className={cx('image')} />
        <h2 className={cx('title')}>React Component</h2>
      </div>
      <p className={cx('description')}>
        Create or use existing templates for your deployments, pods, certificates. Reduce changes of
        failures copypasting yaml files from previous project. Create or use existing templates for
        your deployments, pods, certificates.{' '}
      </p>
      {items.map(({ id, name }) => (
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
  collectionId: PropTypes.string.isRequired,
};

export default Collection;
