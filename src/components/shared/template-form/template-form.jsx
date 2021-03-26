import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { cloneDeep } from 'lodash';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';
import { FilesContext, filesReducer, formatFilesDataForApi } from 'contexts/files-provider';
import { useTemplateGroups } from 'contexts/template-groups-provider';

import Files from './files';
import Prompts from './prompts';
import styles from './template-form.module.scss';

const Editor = dynamic(import('components/editor'), { ssr: false });

const cx = classNames.bind(styles);

const promptsSchema = {
  message: yup.string().required('Message is required'),
  variableName: yup.string().required('Variable name is required'),
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/[a-zA-Z| |-]+/, { message: "Name should contain only A-Za-z letters, space or '-'" }),
  prompts: yup
    .array()
    .of(yup.object().shape(promptsSchema))
    .compact((v) => v.message === '' && v.variableName === ''),
});

const defaultTemplateValues = {
  name: '',
  prompts: [],
  files: [],
};

const TemplateForm = ({
  initialValues = defaultTemplateValues,
  isCreatingNewTemplate = false,
  onSave,
}) => {
  const { register, control, handleSubmit, reset, clearErrors, errors } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(cloneDeep(initialValues));
  }, [initialValues, reset]);

  const [isLoading, setIsLoading] = useState(false);

  const { groups } = useTemplateGroups();

  const [filesState, dispatch] = useReducer(filesReducer, {
    files: initialValues.files,
    openFileId: null,
  });

  const onSubmit = async ({ name, prompts }) => {
    const filesForApi = formatFilesDataForApi(filesState.files);

    try {
      setIsLoading(true);

      const newTemplateData = {
        name,
        prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
        files: JSON.stringify(filesForApi),
        // @TODO: change to selected group after group select is added
        templateGroupId: groups[0].id,
      };

      await onSave(newTemplateData);

      setIsLoading(false);
      mutate('getOwnedTemplateGroups');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    clearErrors();
  };

  return (
    <FilesContext.Provider
      value={{
        state: filesState,
        filesDispatch: dispatch,
      }}
    >
      <div className={cx('wrapper')}>
        <div className={cx('left-column')}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className={cx('title')}>
              {isCreatingNewTemplate ? 'Create template' : 'Edit template'}
            </h1>
            <div className={cx('main')}>
              <Input label="Template name" name="name" register={register} errors={errors.name} />
            </div>
            <div className={cx('prompts-wrapper')}>
              <Prompts
                control={control}
                register={register}
                errors={errors}
                showPrompts={!isCreatingNewTemplate && initialValues.prompts.length > 0}
              />
            </div>
            <div className={cx('files-wrapper')}>
              <Files />
            </div>
            <Button className={cx('create')} type="submit" loading={isLoading}>
              {isCreatingNewTemplate ? 'Create' : 'Save'}
            </Button>
          </form>
        </div>
        <div className={cx('right-column')}>
          <Editor />
        </div>
      </div>
    </FilesContext.Provider>
  );
};

export default TemplateForm;
