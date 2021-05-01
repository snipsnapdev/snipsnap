import classNames from 'classnames/bind';
import Link from 'next/link';

import Input from 'components/shared/input';
import Button from 'components/shared/new-button';

import styles from './steps.module.scss';

const cx = classNames.bind(styles);

const Steps = () => (
  <>
    <h2 className={cx('title')}>Get started with Snipsnap!</h2>
    <ul>
      <li className={cx('item')}>
        <h3 className={cx('item-title')}>Install VS Code extension</h3>
        <Button tag="a" href="vscode:extension/snipsnapdev.snipsnap-vscode">
          Install extension
        </Button>
      </li>
      <li className={cx('item')}>
        <h3 className={cx('item-title')}>Add API token to Extension settings</h3>
        <Input
          className={cx('item-input')}
          value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMzdWIiOiI"
          readOnly
        />
        <div className={cx('item-footer', 'end')}>
          <Button type="button" themeType="link">
            Copy
          </Button>
          <Button type="button" themeType="link">
            Refresh
          </Button>
        </div>
      </li>
      <li className={cx('item')}>
        <h3 className={cx('item-title')}>Create first template</h3>
        <div className={cx('item-footer')}>
          <Link href="/create-template">
            <Button tag="a">Create template</Button>
          </Link>
          <Link href="/marketplace">
            <Button tag="a" themeType="link" size="md">
              or check our Marketplace
            </Button>
          </Link>
        </div>
      </li>
      <li className={cx('item')}>
        <h3 className={cx('item-title')}>Useful links</h3>
        <ul className={cx('item-list')}>
          <li className={cx('item-list-item')}>
            <Link href="/">
              <Button tag="a" themeType="link" size="md">
                Guides
              </Button>
            </Link>
          </li>
          <li className={cx('item-list-item')}>
            <Button
              tag="a"
              themeType="link"
              size="md"
              href="vscode:extension/snipsnapdev.snipsnap-vscode"
            >
              Install VS Code extension
            </Button>
          </li>
        </ul>
      </li>
    </ul>
  </>
);

export default Steps;
