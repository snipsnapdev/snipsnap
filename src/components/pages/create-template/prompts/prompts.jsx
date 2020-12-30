import React from 'react';
import classNames from 'classnames/bind';
import Tooltip from 'components/shared/tooltip';
import styles from './prompts.module.scss';

const cx = classNames.bind(styles);

const Prompts = (props) => (
  <div className={cx('wrapper')}>
    <h2 className="with-tooltip">
      Prompts
      <Tooltip position="bottom">
        <p>
          Prompts represent list of questions that will be asked during template execution from
          users as a popup.
        </p>
        <p>
          Answers you can use as variables inside templates or filenames by using % myVariable %
        </p>
      </Tooltip>
    </h2>
  </div>
);

export default Prompts;
