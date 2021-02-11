import classNames from 'classnames/bind';
import { signOut } from 'next-auth/client';

import Dropdown from 'components/shared/dropdown';
import useSession from 'hooks/use-session';

import Avatar from '../avatar';
import Button from '../button';

import Menu from './menu/menu';
import styles from './sidebar.module.scss';
import TemplatesGroups from './templates-groups';

const cx = classNames.bind(styles);

const Sidebar = () => {
  const [session] = useSession();
  const {
    user: { name: userName, image: avatar },
  } = session;

  const userMenu = (
    <>
      <a href="/" onClick={() => signOut()}>
        Log Out
      </a>
    </>
  );

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-wrapper')}>
        <Dropdown menu={userMenu} className={cx('user-info')}>
          <Avatar userName={userName} avatar={avatar} className={cx('avatar')} />
          <span>{userName}</span>
        </Dropdown>
        <Button to="/create-template" theme="primary">
          Create Template
        </Button>
      </div>
      <Menu />
      <TemplatesGroups />
    </div>
  );
};

export default Sidebar;
