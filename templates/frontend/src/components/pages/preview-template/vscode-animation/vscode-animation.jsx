import classNames from 'classnames/bind';
import Handlebars from 'handlebars';
import { camelCase, snakeCase, kebabCase, upperCase, lowerCase, startCase } from 'lodash';
import { useState, useEffect } from 'react';

import FolderMenu from './folder-menu';
import PromptInput from './prompt-input';
import TemplateSelect from './template-select';
import styles from './vscode-animation.module.scss';
import VscodeLayout from './vscode-layout';

const cx = classNames.bind(styles);

// handlebars helpers
Handlebars.registerHelper('toCamelCase', (string) => camelCase(string));
Handlebars.registerHelper('toSnakeCase', (string) => snakeCase(string));
Handlebars.registerHelper('toKebabCase', (string) => kebabCase(string));
Handlebars.registerHelper('toUpperCase', (string) => upperCase(string));
Handlebars.registerHelper('toLowerCase', (string) => lowerCase(string));
Handlebars.registerHelper('toPascalCase', (string) =>
  startCase(camelCase(string)).replace(/ /g, '')
);

const sleepMs = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PROMPTS_VALUES = [
  'value-one',
  'value-two',
  'value-three',
  'value-four',
  'value-five',
  'value-six',
  'value-seven',
  'value-eight',
  'value-nine',
  'value-ten',
];

/* set to values <1 to speed up animation during development
WARN: active element highlights and typing effect
won't work correctly in this case */
const DEV_SPEED_COEFFICIENT = 1; // default 1

const BEFORE_ANIMATION_START_MS = 700 * DEV_SPEED_COEFFICIENT;
const RESET_TIME_MS = 100;
const STEP_TIME_MS = 1600 * DEV_SPEED_COEFFICIENT;
const PROMP_TIME_MS = 2800 * DEV_SPEED_COEFFICIENT;

const VscodeAnimation = ({ template }) => {
  const [animationStep, setAnimationStep] = useState('initial');

  useEffect(() => {
    const animationSequence = async () => {
      const prompts = JSON.parse(template.prompts);
      await sleepMs(BEFORE_ANIMATION_START_MS);

      await setAnimationStep('menu');
      await sleepMs(STEP_TIME_MS);

      await setAnimationStep('reset');
      await sleepMs(RESET_TIME_MS);

      await setAnimationStep('templates');
      await sleepMs(STEP_TIME_MS);

      await setAnimationStep('reset');
      await sleepMs(RESET_TIME_MS);

      if (prompts.length > 0) {
        for (let i = 0; i < prompts.length; i++) {
          await setAnimationStep(`prompt-${i}`);
          await sleepMs(PROMP_TIME_MS);

          // need this to reset typewriter value
          await setAnimationStep('reset');
          await sleepMs(RESET_TIME_MS);
        }
      }
      await setAnimationStep('files');
    };

    animationSequence();
  }, [template.prompts]);

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
