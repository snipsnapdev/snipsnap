import classNames from 'classnames/bind';
import Typewriter from 'typewriter-effect';

import styles from './prompt-input.module.scss';

const cx = classNames.bind(styles);

const PromptInput = ({ value, message, className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-text')}>
        <Typewriter
          onInit={(typewriter) => {
            typewriter.pauseFor(500).typeString(value).start();
          }}
        />
      </span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option')}>{message}</div>
    </div>
  </div>
);

export default PromptInput;
