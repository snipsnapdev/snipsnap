import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';

import styles from './vscode-animation.module.scss';
import VscodeLayout from './vscode-layout';

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

const TEMPLATES = ['Create React Component', 'Dockerfile', 'NodeJS + Express'];

const TemplateSelect = ({ className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-placeholder')}>Please choose a template you want to use</span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option', 'active')}>DEMO TEMPLATE</div>
      {TEMPLATES.map((template) => (
        <div key={template} className={cx('select-option')}>
          {template}
        </div>
      ))}
    </div>
  </div>
);

const PromptInput = ({ className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-text')}>
        <Typewriter
          onInit={(typewriter) => {
            typewriter.pauseFor(500).typeString('example value').start();
          }}
        />
      </span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option')}>
        Please type component name (Press 'Enter' to confirm or 'Escape' to cancel)
      </div>
    </div>
  </div>
);

const sleepMs = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VscodeAnimation = ({ template }) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const [animationStep, setAnimationStep] = useState('initial');
  const animationSequence = async () => {
    await sleepMs(1000);
    await setAnimationStep('menu');
    await sleepMs(2500);
    await setAnimationStep('templates');
    await sleepMs(2500);
    await setAnimationStep('prompt');
    await sleepMs(3500);
    await setAnimationStep('files');

    setAnimationCompleted(true);
  };

  useEffect(() => {
    animationSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx('animation')}>
      <VscodeLayout
        className={cx('vscode')}
        template={template}
        showFiles={animationStep === 'files'}
      />
      {animationStep === 'menu' && <FolderMenu />}
      {animationStep === 'templates' && <TemplateSelect className={cx('template-select')} />}
      {animationStep === 'prompt' && <PromptInput className={cx('prompt-input')} />}
    </div>
  );
};

export default VscodeAnimation;
