import classNames from 'classnames/bind';

import SupportUs from 'components/shared/support-us';
import UseCases from 'components/shared/use-cases';
import VideoPlayer from 'components/shared/video-player';

import styles from './home.module.scss';
import Steps from './steps';

const cx = classNames.bind(styles);

const Home = () => (
  <div className={cx('wrapper')}>
    <div className={cx('left')}>
      <Steps />
    </div>
    <div className={cx('right')}>
      <SupportUs />
      <VideoPlayer className={cx('video')} />
      <UseCases />
    </div>
  </div>
);

export default Home;
