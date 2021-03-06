import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './video-player.module.scss';

const cx = classNames.bind(styles);

const VideoPlayer = ({ className: additionalClassName }) => (
  <div className={cx('wrapper', additionalClassName)}>
    <div className={cx('inner')}>
      <iframe
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        src="https://www.youtube-nocookie.com/embed/G7J_rWiMzwE?rel=0"
        allowFullScreen
      />
    </div>
  </div>
);

VideoPlayer.propTypes = {
  className: PropTypes.string,
};

VideoPlayer.defaultProps = {
  className: null,
};

export default VideoPlayer;
