import classNames from 'classnames/bind';
import Handlebars from 'handlebars';
import {
  cloneDeep,
  camelCase,
  snakeCase,
  kebabCase,
  upperCase,
  lowerCase,
  startCase,
} from 'lodash';
import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';

import styles from './vscode-animation.module.scss';
import VscodeLayout from './vscode-layout';

const cx = classNames.bind(styles);

Handlebars.registerHelper('toCamelCase', (string) => camelCase(string));

Handlebars.registerHelper('toSnakeCase', (string) => snakeCase(string));

Handlebars.registerHelper('toKebabCase', (string) => kebabCase(string));

Handlebars.registerHelper('toUpperCase', (string) => upperCase(string));

Handlebars.registerHelper('toLowerCase', (string) => lowerCase(string));

Handlebars.registerHelper('toPascalCase', (string) =>
  startCase(camelCase(string)).replace(/ /g, '')
);

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

const TEMPLATES = ['Storybook for React Component', 'Dockerfile', 'NodeJS + Express'];

const TemplateSelect = ({ templateName, className }) => (
  <div className={cx('select-wrapper', className)}>
    <div className={cx('select-input')}>
      <span className={cx('select-placeholder')}>Please choose a template you want to use</span>
    </div>
    <div className={cx('select-options')}>
      <div className={cx('select-option', 'active')}>{templateName}</div>
      {TEMPLATES.map((template) => (
        <div key={template} className={cx('select-option')}>
          {template}
        </div>
      ))}
    </div>
  </div>
);

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

const sleepMs = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PROMPTS_VALUES = ['value one', 'value two', 'value three', 'value four'];

const VscodeAnimation = ({ template }) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [animationStep, setAnimationStep] = useState('initial');

  const animationSequence = async () => {
    const prompts = JSON.parse(template.prompts);

    const RESET_TIME_MS = 100;

    await sleepMs(1000);
    await setAnimationStep('menu');
    await sleepMs(2500);
    await setAnimationStep('reset');
    await sleepMs(RESET_TIME_MS);
    await setAnimationStep('templates');
    await sleepMs(2500);
    await setAnimationStep('reset');
    await sleepMs(RESET_TIME_MS);
    if (prompts.length > 0) {
      for (let i = 0; i < prompts.length; i++) {
        await setAnimationStep(`prompt-${i}`);
        await sleepMs(3500);
        // to reset typewriter value
        await setAnimationStep('reset');
        await sleepMs(RESET_TIME_MS);
      }
    }
    await setAnimationStep('files');

    setAnimationCompleted(true);
  };

  useEffect(() => {
    animationSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [promptValues, setPromptValues] = useState({});
  const [templateFiles, setTemplateFiles] = useState([]);
  useEffect(() => {
    const newPromptResults = {};

    const prompts = JSON.parse(template.prompts);
    prompts.forEach((t, index) => {
      newPromptResults[t.variableName] = PROMPTS_VALUES[index];
    });

    const files = JSON.parse(template.files);
    // insert handlebar values
    const processItem = (item) => {
      item.data.name = Handlebars.compile(item.data.name)(newPromptResults);
      if (item.type === 'file') {
        item.data.content = Handlebars.compile(item.data.content)(newPromptResults);
      } else {
        item.data.files = item.data.files.map(processItem);
      }
      return item;
    };

    setTemplateFiles(prompts.length > 0 ? files.map(processItem) : files);
    setPromptValues(newPromptResults);
  }, [template.files, template.prompts]);

  return (
    <div className={cx('animation')}>
      <VscodeLayout
        className={cx('vscode')}
        templateFiles={templateFiles}
        showFiles={animationStep === 'files'}
        templateName={template.name}
      />
      {animationStep === 'menu' && <FolderMenu />}
      {animationStep === 'templates' && (
        <TemplateSelect templateName={template.name} className={cx('template-select')} />
      )}
      {animationStep.startsWith('prompt') && (
        <PromptInput
          value={PROMPTS_VALUES[parseInt(animationStep.replace('prompt-', ''))]}
          className={cx('prompt-input')}
          message={
            JSON.parse(template.prompts)[parseInt(animationStep.replace('prompt-', ''))].message
          }
        />
      )}
    </div>
  );
};

export default VscodeAnimation;
