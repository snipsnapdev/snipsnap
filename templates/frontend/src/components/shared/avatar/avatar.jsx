import classNames from 'classnames/bind';
import Image from 'next/image';
import PropTypes from 'prop-types';

import styles from './avatar.module.scss';

const cx = classNames.bind(styles);

const Avatar = ({ className: additionalClassName, userName, avatar }) => {
  const symbol = userName?.slice(0, 1);

  return (
    <div className={cx('wrapper', additionalClassName)}>
      {avatar ? (
        <Image src={avatar} width={30} height={30} />
      ) : (
        <div className={cx('symbol')}>{symbol}</div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
  userName: PropTypes.string,
  avatar: PropTypes.string,
};

Avatar.defaultProps = {
  className: null,
  userName: null,
  avatar: null,
};

export default Avatar;
