import classNames from 'classnames/bind';
import { useReducer, useState, useEffect } from 'react';

import FileBrowser from 'components/shared/file-browser';
import ArrowSvg from 'icons/arrow-down.inline.svg';
import DotsIcon from 'icons/dots.inline.svg';


import styles from './vscode-sidebar.module.scss';

const cx = classNames.bind(styles);

const VscodeSidebar = ({ showFiles }) => (
    <div className={cx('sidebar')}>
      <div className={cx('top')}>
        EXPLORER
        <DotsIcon className={cx('icon-dots')} />
      </div>
      <div className={cx('section', 'open-editors')}>
        <div className={cx('section-title')}>
          <ArrowSvg className={cx('icon-down')} />
          OPEN EDITORS
        </div>
      </div>
      <div className={cx('section', 'current-files')}>
        <div className={cx('section-title')}>
          <ArrowSvg className={cx('icon-down')} />
          MY-EXAMPLE
        </div>
        {showFiles && <FileBrowser className={cx('files')} readOnly />}
      </div>
      <div className={cx('section', 'outline')}>
        <div className={cx('section-title')}>
          <ArrowSvg className={cx('icon-down')} />
          OUTLINE
        </div>
      </div>
    </div>
  );

export default VscodeSidebar;
