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

// TODO move to a separate component
const Prompt = React.forwardRef(({ item, index, errors, remove }, ref) => (
  <li className={cx('item')} key={item.id}>
    <Input
      className={cx('item-input')}
      label="Message"
      name={`prompts[${index}].message`}
      defaultValue={item.message}
      register={ref}
      errors={errors?.prompts?.[index]?.message}
    />
    <Input
      className={cx('item-input')}
      label="Variable name"
      name={`prompts[${index}].variableName`}
      defaultValue={item.variableName}
      register={ref}
      errors={errors?.prompts?.[index]?.variableName}
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
const Prompts = ({
  title,
  tooltip,
  buttonText,
  showPrompts = false,
  control,
  errors,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prompts',
  });

  const [visibilityPrompts, setVisibilityPrompts] = useState(showPrompts);

  const addItem = () => {
    append({ message: '', variableName: '' });
    setVisibilityPrompts(true);
  };

  const handleVisibilityPrompts = () => setVisibilityPrompts(!visibilityPrompts);

  useEffect(() => {
    if (fields.length === 0) {
      setVisibilityPrompts(false);
    }
  }, [fields]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('head')}>
        <h2>{title}</h2>
        <Button
          className={cx('button-disclosure', { active: visibilityPrompts })}
          theme="secondary"
          disabled={!fields.length > 0}
          onClick={handleVisibilityPrompts}
        >
          <ArrowRightSvg />
        </Button>
        <Tooltip className={cx('tooltip')} position="bottom">
          {tooltip}
        </Tooltip>
      </div>
      <div className={cx('items-wrapper', { active: visibilityPrompts })}>
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

      <Button type="button" theme="tertiary" onClick={addItem}>
        {buttonText}
      </Button>
    </div>
  );
};

Prompts.defaultProps = {
  title: 'Prompts',
  tooltip: `
          <p>
            Prompts represent list of questions that will be asked during template execution from
            users as a popup.
          </p>
          <p>
            Answers you can use as variables inside templates or filenames by using % myVariable %
          </p>
  `,
  buttonText: '+ Add prompt',
};

Prompts.propTypes = {
  title: PropTypes.string,
  tooltip: PropTypes.string,
  buttonText: PropTypes.string,
};

export default Prompts;
