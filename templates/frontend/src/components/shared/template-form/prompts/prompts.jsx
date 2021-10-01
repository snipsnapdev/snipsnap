import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Tooltip from 'components/shared/tooltip';
import ArrowRightSvg from 'icons/arrow-right.inline.svg';
import CloseSvg from 'icons/close.inline.svg';
import PlusSignSvg from 'icons/plus.inline.svg';

import styles from './prompts.module.scss';

const ReactTooltip = dynamic(() => import('react-tooltip'), {
  ssr: false,
});

const cx = classNames.bind(styles);

const Prompt = React.forwardRef(({ item, trigger, index, errors, remove, readOny }, ref) => (
  <li className={cx('item')} key={item.id}>
    <Input
      className={cx('item-input')}
      label="Message"
      name={`prompts[${index}].message`}
      defaultValue={item.message}
      register={ref}
      error={errors?.prompts?.[index]?.message?.message}
      onBlur={() => trigger('prompts')}
    />
    <Input
      className={cx('item-input')}
      label="Variable name"
      name={`prompts[${index}].variableName`}
      defaultValue={item.variableName}
      register={ref}
      error={errors?.prompts?.[index]?.variableName?.message}
      onBlur={() => trigger('prompts')}
    />
    <Input
      className={cx('item-input')}
      label="Default value"
      name={`prompts[${index}].defaultValue`}
      defaultValue={item.defaultValue}
      register={ref}
      error={errors?.prompts?.[index]?.defaultValue?.message}
      onBlur={() => trigger('prompts')}
    />

    {!readOny && (
      <span
        className={cx('item-button-remove')}
        onClick={() => {
          remove(index);
        }}
      >
        <CloseSvg />
      </span>
    )}
  </li>
));
const Prompts = ({ control, trigger, errors, register, readOny = false }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prompts',
  });

  const addItem = () => {
    if (readOny) {
      return;
    }
    append({ message: '', variableName: '' });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('head')}>
        <h2 className={cx('title')}>Prompts</h2>
        <Tooltip dataFor="tooltip" />
        <ReactTooltip
          className={cx('tooltip')}
          effect="solid"
          place="right"
          id="tooltip"
          delayHide={500}
          clickable
        >
          <p>
            Prompts represent list of questions that will be asked during template execution from
            users as a popup.
          </p>
          <p>
            Answers you can use as variables inside templates or filenames like this{' '}
            {'{{variableName}}'}
          </p>
          <Button
            tag="a"
            target="_blank"
            href="https://github.com/snipsnapdev/snipsnap/tree/master/templates#template-engine-support"
            themeType="link"
          >
            Learn more
          </Button>
        </ReactTooltip>
      </div>
      <div className={cx('items-wrapper')}>
        <ul>
          {fields.map((item, index) => (
            <Prompt
              key={index}
              ref={register}
              item={item}
              index={index}
              remove={remove}
              errors={errors}
              trigger={trigger}
              readOny={readOny}
            />
          ))}
        </ul>
      </div>

      <Button type="button" themeColor="custom" className={cx('add-button')} onClick={addItem}>
        <PlusSignSvg />
        Add Prompt
      </Button>
    </div>
  );
};

export default Prompts;
