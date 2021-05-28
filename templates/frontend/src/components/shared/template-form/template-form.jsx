import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState, useEffect, useReducer, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { useGqlClient } from 'api/graphql';
import { createTemplateMutation, editTemplateMutation } from 'api/mutations';
import AsyncButton from 'components/shared/async-button';
import Button from 'components/shared/button';
import Dropdown from 'components/shared/dropdown';
import Input from 'components/shared/input';
import { ErrorModalContext } from 'contexts/error-modal-context';
import { FilesContext, filesReducer } from 'contexts/files-provider';
import { useTemplateGroups } from 'contexts/template-groups-provider';
import { useAlertIfUnsavedChanges } from 'hooks/use-alert-if-unsaved-changes';

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

const TemplateForm = ({ initialValues, isCreatingNewTemplate = false, templateId = null }) => {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    clearErrors,
    errors,
    formState: { isDirty },
  } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const gqlClient = useGqlClient();

  const router = useRouter();
  const { openFile } = router.query;

  const { showErrorModal } = useContext(ErrorModalContext);

  const { groups } = useTemplateGroups();

  const [group, setGroup] = useState(
    groups.find((group) => group.id === initialValues.groupId) || null
  );

  const [filesState, dispatch] = useReducer(filesReducer, {
    files: initialValues.files,
    openFileId: openFile || null,
    hasChangedFiles: false,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      register(inputRef.current);
      if (isCreatingNewTemplate) {
        inputRef.current.focus();
      }
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
        openFileId: openFile || null,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // show alert if form is dirty before changing URL
  // useAlertIfUnsavedChanges(isCreatingNewTemplate ? true : isDirty || filesState.hasChangedFiles);

  const handleCreateTemplate = async ({ name, prompts, files, templateGroupId, openFileId }) => {
    const res = await gqlClient.request(createTemplateMutation, {
      name,
      prompts,
      files,
      ...(templateGroupId ? { templateGroupId } : {}),
    });

    const newTemplateId = res?.insert_template?.id || null;

    if (newTemplateId) {
      router.push(`/template/${newTemplateId}/edit${openFileId ? `?openFile=${openFileId}` : ''}`);
    }
  };

  const handleEditTemplate = async ({ name, prompts, files, templateGroupId, openFileId }) => {
    await gqlClient.request(editTemplateMutation, {
      id: templateId,
      name,
      prompts,
      files,
      ...(templateGroupId ? { templateGroupId } : {}),
    });

    router.push(`/template/${templateId}/edit${openFileId ? `?openFile=${openFileId}` : ''}`);
  };

  const onSubmit = async ({ name, prompts }) => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    console.log('submitting');

    try {
      const newTemplateData = {
        name,
        prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
        files: JSON.stringify(filesState.files),
        ...(group ? { templateGroupId: group.id } : {}),
      };

      if (isCreatingNewTemplate) {
        await handleCreateTemplate({ ...newTemplateData, openFileId: filesState.openFileId });
      } else {
        await handleEditTemplate({ ...newTemplateData, openFileId: filesState.openFileId });
      }

      mutate('getOwnedTemplateGroups');
    } catch (error) {
      const errorMessage = JSON.parse(JSON.stringify(error)).response.errors[0].message;
      throw new Error(errorMessage);
    }

    clearErrors();
  };

  const handleError = (error) => {
    showErrorModal(
      `Failed to ${isCreatingNewTemplate ? 'create template' : 'save changes'}${
        error ? `: \n${error.message}.` : '.'
      }`
    );
  };

  // save form on cmd/ctrl + S press
  useEffect(() => {
    const keyDownHandler = async (event) => {
      if (
        (window && window.navigator.platform.toUpperCase().indexOf('MAC') >= 0
          ? event.metaKey
          : event.ctrlKey) &&
        event.keyCode == 83
      ) {
        event.preventDefault();

        if (document) {
          const saveButton = document.getElementById('form-submit-button');
          if (saveButton) {
            saveButton.click();
          }
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [initialValues]);

  const handleCancelButtonClick = () => {
    if (isCreatingNewTemplate) {
      router.back();
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
      theme: 'grey',
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
              <div className={cx('scroll-box')}>
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
              </div>
              <div className={cx('buttons-wrapper')}>
                <AsyncButton
                  id="form-submit-button"
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
