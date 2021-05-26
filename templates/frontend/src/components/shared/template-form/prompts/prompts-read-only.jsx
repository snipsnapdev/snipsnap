import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Input from 'components/shared/input';
import Tooltip from 'components/shared/tooltip';

import styles from './prompts.module.scss';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});

const cx = classNames.bind(styles);

const Prompt = ({ item, index }) => (
  <li className={cx('item')} key={item.id}>
    <Input
      className={cx('item-input')}
      label="Message"
      name={`prompts[${index}].message`}
      defaultValue={item.message}
      readOnly
    />
    <Input
      className={cx('item-input')}
      label="Variable name"
      name={`prompts[${index}].variableName`}
      defaultValue={item.variableName}
      readOnly
    />
  </li>
);

const Prompts = ({ prompts }) => (
    <div className={cx('wrapper')}>
      <div className={cx('head')}>
        <h2 className={cx('title')}>Prompts</h2>
        <Tooltip dataFor="tooltip" />
        <ReactTooltip className={cx('tooltip')} effect="solid" place="right" id="tooltip" clickable>
          <p>
            Prompts represent list of questions that will be asked during template execution from
            users as a popup.
          </p>
          <p>
            Answers you can use as variables inside templates or filenames by using % myVariable %
          </p>
        </ReactTooltip>
      </div>
      <div className={cx('items-wrapper')}>
        <ul>
          {prompts.map((item, index) => (
            <Prompt key={index} item={item} index={index} />
          ))}
        </ul>
      </div>
    </div>
  );

export default Prompts;
