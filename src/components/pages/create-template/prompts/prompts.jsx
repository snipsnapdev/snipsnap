import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import Tooltip from 'components/shared/tooltip';
import ArrowRightSvg from 'icons/arrow-right.inline.svg';
import CloseSvg from 'icons/close.inline.svg';

import styles from './prompts.module.scss';


const formSchema = {
  message: yup.string().required('message is required'),
  variableName: yup.string().required('variableName is required'),
};

const fieldsSchema = yup.object().shape({
  prompts: yup.array().of(yup.object().shape(formSchema)).required(),
});

const cx = classNames.bind(styles);

const Prompts = ({ title, tooltip, buttonText }) => {
  const { register, control, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(fieldsSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prompts',
  });

  const [visibilityPrompts, setVisibilityPrompts] = useState(false);

  const {isValid} = formState;

  const addItem = () => {
    if (fields.length === 0) {
      append({ message: '', variableName: '' });
    } else if (isValid) {
      append({ message: '', variableName: '' });
    }

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
        <h2 className="with-tooltip">{title}</h2>

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

      <div className={cx('content')}>
        <div className={cx('items-wrapper', { active: visibilityPrompts })}>
          <form onBlur={handleSubmit((values) => console.log(values))}>
            <ul>
              {fields.map((item, index) => (
                <li className={cx('item')} key={item.id}>
                  <Input
                    className={cx('item-input')}
                    label="Message"
                    name={`prompts[${index}].message`}
                    defaultValue={item.message}
                    ref={register()}
                    errors={errors?.prompts?.[index]?.message}
                  />
                  <Input
                    className={cx('item-input')}
                    label="Variable name"
                    name={`prompts[${index}].variableName`}
                    defaultValue={item.variableName}
                    ref={register()}
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
              ))}
            </ul>
          </form>
        </div>

        <Button theme="tertiary" onClick={addItem}>
          {buttonText}
        </Button>
      </div>
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
