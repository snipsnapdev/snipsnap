import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState, useEffect, useReducer, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import AsyncButton from 'components/shared/async-button';
import Button from 'components/shared/button';
import Dropdown from 'components/shared/dropdown';
import Input from 'components/shared/input';
import { ErrorModalContext } from 'contexts/error-modal-context';
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
  name: yup.string().required('Name is required'),
  prompts: yup
    .array()
    .of(yup.object().shape(promptsSchema))
    .compact((v) => v.message === '' && v.variableName === ''),
});

const TemplateForm = ({ initialValues, isCreatingNewTemplate = false, onSave }) => {
  const {
    register,
    control,
    trigger,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    errors,
  } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const { back } = useRouter();
  const { showErrorModal } = useContext(ErrorModalContext);

  const { groups } = useTemplateGroups();

  const [group, setGroup] = useState(
    groups.find((group) => group.id === initialValues.groupId) || null
  );

  const [filesState, dispatch] = useReducer(filesReducer, {
    files: initialValues.files,
    openFileId: null,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      register(inputRef.current);
      inputRef.current.focus();
    }

    // handle initial values change
    setValue('name', initialValues.name);
    setValue('prompts', initialValues.prompts);
    setValue('files', initialValues.files);
    setGroup(groups.find((group) => group.id === initialValues.groupId) || null);
    dispatch({
      type: 'reset',
      data: {
        files: initialValues.files,
        openFileId: null,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const onSubmit = async ({ name, prompts }) => {
    const filesForApi = formatFilesDataForApi(filesState.files);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const newTemplateData = {
        name,
        prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
        files: JSON.stringify(filesForApi),
        ...(group ? { templateGroupId: group.id } : {}),
      };

      await onSave(newTemplateData);

      mutate('getOwnedTemplateGroups');
    } catch (err) {
      throw new Error(err);
    }

    clearErrors();
  };

  const handleError = (err) => {
    showErrorModal(`Failed to ${isCreatingNewTemplate ? 'create template' : 'save changes'}`);
    console.error(`Failed to ${isCreatingNewTemplate ? 'create template' : 'save changes'}`, err);
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

  const groupOptions = [
    ...groups.map((item) => ({
      text: item.name,
      onClick: () => setGroup(item),
    })),
    {
      text: 'No group',
      onClick: () => setGroup(null),
    },
  ];

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <FilesContext.Provider
      value={{
        state: filesState,
        filesDispatch: dispatch,
      }}
    >
      <div className={cx('wrapper')}>
        <h1 className={cx('title')}>
          {isCreatingNewTemplate ? 'Create template' : <>Edit template "{initialValues.name}"</>}
        </h1>
        <div className={cx('inner')}>
          <div className={cx('left-column')}>
            <form className={cx('form')}>
              <div className={cx('name')}>
                <Input
                  label="Template name"
                  name="name"
                  ref={inputRef}
                  error={errors.name?.message}
                />
              </div>

              <div className={cx('group-label')}>Group</div>
              <Dropdown
                menuItems={groupOptions}
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
                  trigger={trigger}
                  errors={errors}
                  showPrompts={!isCreatingNewTemplate && initialValues.prompts.length > 0}
                />
              </div>
              <div className={cx('files-wrapper')}>
                <Files />
              </div>
              <div className={cx('buttons-wrapper')}>
                <AsyncButton
                  disabled={!isFormValid}
                  type="submit"
                  text={isCreatingNewTemplate ? 'Create template' : 'Save changes'}
                  successText="Saved"
                  onClick={handleSubmit(onSubmit)}
                  onError={handleError}
                />
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
