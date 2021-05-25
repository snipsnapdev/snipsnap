import classNames from 'classnames/bind';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';

import styles from './use-cases.module.scss';

const cx = classNames.bind(styles);

const UseCases = ({ cases }) => (
  <div className={cx('wrapper')}>
    <h2 className={cx('title')}>Use cases</h2>
    <ul className={cx('links')}>
      {cases.map(({ title, url }, index) => (
        <li key={index}>
          <Button href={url} target="_blank" tag="a" themeType="link" size="md">
            {title}
          </Button>
        </li>
      ))}
    </ul>
  </div>
);

UseCases.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
};

UseCases.defaultProps = {
  cases: [
    {
      title: 'Kubernetes',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#kubernetes',
    },
    {
      title: 'CI/CD',
      url: 'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#cicd',
    },
    {
      title: 'Docker',
      url: 'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#docker',
    },
    {
      title: 'React',
      url: 'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#react',
    },
    {
      title: 'Vue',
      url: 'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#vue',
    },
    {
      title: 'Graphql',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#graphql',
    },
    {
      title: 'Webinars',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#webinars',
    },
    {
      title: 'Starters',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#starters',
    },
    {
      title: 'Node.js',
      url: 'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#nodejs',
    },
    {
      title: 'Tailwind',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#tailwind',
    },
    {
      title: 'Wordpress',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#wordpress',
    },
    {
      title: 'Linters',
      url:
        'https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md#linters',
    },
  ],
};

export default UseCases;
