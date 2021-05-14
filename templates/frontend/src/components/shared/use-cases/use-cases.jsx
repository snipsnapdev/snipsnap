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
          <Link href={url}>
            <Button tag="a" themeType="link" size="md">
              With {title}
            </Button>
          </Link>
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
    { title: 'Kubernetes', url: '/' },
    { title: 'Docker', url: '/' },
    { title: 'React', url: '/' },
    { title: 'Angular', url: '/' },
    { title: 'Vue', url: '/' },
    { title: 'Kubernetes', url: '/' },
    { title: 'Docker', url: '/' },
    { title: 'React', url: '/' },
    { title: 'Angular', url: '/' },
    { title: 'Vue', url: '/' },
    { title: 'Kubernetes', url: '/' },
    { title: 'Docker', url: '/' },
    { title: 'React', url: '/' },
    { title: 'Angular', url: '/' },
    { title: 'Vue', url: '/' },
  ],
};

export default UseCases;
