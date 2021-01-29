import classNames from 'classnames/bind';
import Image from 'next/image';
import PropTypes from 'prop-types';

import styles from './avatar.module.scss';

const cx = classNames.bind(styles);

const Avatar = ({ userName, avatar, className: additionalClassName }) => {
  const avatarSymbol = userName.slice(0, 1);
  return (
    <div className={cx('avatar-wrapper', additionalClassName)}>
      {avatar ? (
        <Image src={avatar} width={30} height={30} />
      ) : (
        <div className={cx('avatar')}>{avatarSymbol}</div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['md']),
  userName: PropTypes.string.isRequired,
  avatar: PropTypes.string,
};

Avatar.defaultProps = {
  size: 'md',
  className: null,
  avatar: null,
};

export default Avatar;
