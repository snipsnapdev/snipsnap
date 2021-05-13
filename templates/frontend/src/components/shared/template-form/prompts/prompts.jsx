import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Tooltip from 'components/shared/tooltip';
import ArrowRightSvg from 'icons/arrow-right.inline.svg';
import CloseSvg from 'icons/close.inline.svg';

import styles from './prompts.module.scss';

const cx = classNames.bind(styles);

const Prompt = React.forwardRef(({ item, index, errors, remove }, ref) => (
  <li className={cx('item')} key={item.id}>
    <Input
      className={cx('item-input')}
      label="Message"
      name={`prompts[${index}].message`}
      defaultValue={item.message}
      register={ref}
      error={errors?.prompts?.[index]?.message?.message}
    />
    <Input
      className={cx('item-input')}
      label="Variable name"
      name={`prompts[${index}].variableName`}
      defaultValue={item.variableName}
      register={ref}
      error={errors?.prompts?.[index]?.variableName?.message}
    />

    <span
      className={cx('item-button-remove')}
      onClick={() => {
        remove(index);
      }}
    >
      <CloseSvg />
    </span>
  </li>
));
const Prompts = ({ tooltip, control, errors, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prompts',
  });

  const addItem = () => {
    append({ message: '', variableName: '' });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('head')}>
        <h2 className={cx('title')}>Prompts</h2>
        <Tooltip className={cx('tooltip')} position="bottom">
          {tooltip}
        </Tooltip>
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
            />
          ))}
        </ul>
      </div>

      <Button type="button" themeColor="custom" className={cx('add-button')} onClick={addItem}>
        Add Prompt
      </Button>
    </div>
  );
};

Prompts.defaultProps = {
  tooltip: `
          <p>
            Prompts represent list of questions that will be asked during template execution from
            users as a popup.
          </p>
          <p>
            Answers you can use as variables inside templates or filenames by using % myVariable %
          </p>
  `,
};

Prompts.propTypes = {
  tooltip: PropTypes.string,
};

export default Prompts;
