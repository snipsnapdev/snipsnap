import classNames from 'classnames/bind';

import styles from './folder-menu.module.scss';

const cx = classNames.bind(styles);

const MenuItem = ({ name, shortcut = null, disabled = false, active = false }) => (
  <div className={cx('menu-item', disabled && 'disabled', active && 'active')}>
    <span className={cx('item-name')}>{name}</span>
    {shortcut && <span className={cx('item-shortcut')}>{shortcut}</span>}
  </div>
);
const Separator = () => <div className={cx('separator')} />;

const FolderMenu = () => (
  <div className={cx('menu')}>
    <MenuItem name="New File" />
    <MenuItem name="New Folder" />
    <MenuItem name="Reveal in Finder" shortcut="⌥⌘R" />
    <MenuItem name="Open in Integrated Terminal" />
    <Separator />
    <MenuItem name="Create from Template" active />
    <Separator />
    <MenuItem name="Add Folder to Workspace..." />
    <MenuItem name="Open Folder Settings" />
    <MenuItem name="Remove Folder from Workspace" />
    <Separator />
    <MenuItem name="Find in Folder" shortcut="⌥⇧F" />
    <Separator />
    <MenuItem name="Paste" shortcut="⌘V" disabled />
    <Separator />
    <MenuItem name="Copy Path" shortcut="⌥⌘C" />
    <MenuItem name="Copy Relative Path" shortcut="⌥⇧⌘C" />
  </div>
);

export default FolderMenu;
