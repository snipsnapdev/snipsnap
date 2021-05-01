import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { cloneDeep } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState, useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import Dropdown from 'components/shared/dropdown';
import Input from 'components/shared/input';
import Button from 'components/shared/new-button';
import { FilesContext, filesReducer } from 'contexts/files-provider';
import { useTemplateGroups } from 'contexts/template-groups-provider';
import { formatFilesDataForApi } from 'utils/files-provider-helpers';

import Files from './files';
import Prompts from './prompts';
import styles from './template-form.module.scss';

const Editor = dynamic(import('components/shared/editor'), { ssr: false });

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

const TemplateForm = ({ initialValues, isCreatingNewTemplate = false, onSave }) => {
  const { register, control, handleSubmit, reset, clearErrors, errors } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const { back } = useRouter();

  const { groups } = useTemplateGroups();

  const [group, setGroup] = useState(
    groups.find((group) => group.id === initialValues.groupId) || null
  );

  useEffect(() => {
    reset(cloneDeep(initialValues));
  }, [initialValues, reset]);

  const [isLoading, setIsLoading] = useState(false);

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
        ...(group ? { templateGroupId: group.id } : {}),
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

  const handleCancelButtonClick = () => {
    if (isCreatingNewTemplate) {
      back();
    } else {
      reset();
      setGroup(groups.find((group) => group.id === initialValues.groupId) || null);
      dispatch({
        type: 'reset',
        data: {
          files: initialValues.files,
          openFileId: null,
        },
      });
    }
  };

  const groupOptions = (
    <>
      {groups.map((group) => (
        <div key={group.id} onClick={() => setGroup(group)}>
          {group.name}
        </div>
      ))}
      <div onClick={() => setGroup(null)}>No group</div>
    </>
  );

  return (
    <FilesContext.Provider
      value={{
        state: filesState,
        filesDispatch: dispatch,
      }}
    >
      <div className={cx('wrapper')}>
        <h1 className={cx('title')}>
          {isCreatingNewTemplate ? (
            'Create template'
          ) : (
            <>
              Edit template <span>"{initialValues.name}"</span>
            </>
          )}
        </h1>
        <div className={cx('inner')}>
          <div className={cx('left-column')}>
            <form className={cx('form')}>
              <div className={cx('main')}>
                <Input label="Template name" name="name" register={register} errors={errors.name} />
              </div>

              <div className={cx('group-label')}>Group</div>
              <Dropdown
                menu={groupOptions}
                className={cx('group-select')}
                menuClassName={cx('group-select-menu')}
                position="top-right"
                stopPropagation
                showIcon
              >
                <span>{group ? group.name : 'Select group'}</span>
              </Dropdown>
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
              <div className={cx('buttons-wrapper')}>
                <Button type="submit" isLoading={isLoading} onClick={handleSubmit(onSubmit)}>
                  {isCreatingNewTemplate ? 'Create template' : 'Save changes'}
                </Button>
                <Button type="button" themeType="button-link" onClick={handleCancelButtonClick}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
          <div className={cx('right-column')}>
            <Editor />
          </div>
        </div>
      </div>
    </FilesContext.Provider>
  );
};

export default TemplateForm;
