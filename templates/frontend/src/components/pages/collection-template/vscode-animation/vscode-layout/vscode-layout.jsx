import classNames from 'classnames/bind';


import ActivityBottomIcons from './images/activity-bar-bottom.inline.svg';
import ActivityTopIcons from './images/activity-bar-top.inline.svg';
import EmptyEditor from './images/empty-editor.inline.svg';
import FooterLeftIcons from './images/footer-left.inline.svg';
import FooterRightIcons from './images/footer-right.inline.svg';
import TopLeftIcons from './images/top-left-icons.inline.svg';
import styles from './vscode-layout.module.scss';

const cx = classNames.bind(styles);

const VscodeLayout = ({ className }) => (
    <div className={cx('wrapper', className)}>
      <div className={cx('header')}>
        <TopLeftIcons />
        <span className={cx('title')}>TEMPLATE NAME</span>
      </div>
      <div className={cx('content')}>
        <div className={cx('activity-bar')}>
          <ActivityTopIcons />
          <ActivityBottomIcons />
        </div>
        <div className={cx('sidebar')} />
        <div className={cx('editor')}>
          <EmptyEditor />
        </div>
      </div>
      <div className={cx('footer')}>
        <FooterLeftIcons />
        <FooterRightIcons />
      </div>
    </div>
  );

export default VscodeLayout;
