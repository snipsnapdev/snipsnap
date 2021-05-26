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

const ViewOnlyTemplateForm = ({
  initialValues,
  isCreatingNewTemplate = false,
  readOny = false,
  onSave,
}) => {
  const { register, control, trigger, handleSubmit, setValue } = useForm({
    defaultValues: initialValues,
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
  };

  const handleError = (err) => {
    showErrorModal(`Failed to clone template`);
    console.error(`Failed to clone template`, err);
  };

  const handleCancelButtonClick = () => {
    // navigate to marketplace
    back();
  };

  return (
    <FilesContext.Provider
      value={{
        state: filesState,
        filesDispatch: dispatch,
      }}
    >
      <div className={cx('wrapper')}>
        <h1 className={cx('title')}>
          View template <span>"{initialValues.name}"</span>
        </h1>
        <div className={cx('inner')}>
          <div className={cx('left-column')}>
            <form className={cx('form')}>
              <div className={cx('scroll-box')}>
                <div className={cx('name')}>
                  <Input
                    label="Template name"
                    name="name"
                    value={initialValues.name}
                    readOny={!!readOny}
                  />
                </div>

                <div className={cx('prompts-wrapper')}>
                  <Prompts
                    control={control}
                    register={register}
                    trigger={trigger}
                    showPrompts={!isCreatingNewTemplate && initialValues.prompts.length > 0}
                    readOny={readOny}
                  />
                </div>
                <div className={cx('files-wrapper')}>
                  <Files />
                </div>
              </div>
              <div className={cx('buttons-wrapper')}>
                <AsyncButton
                  type="submit"
                  text="Clone"
                  successText="Cloned"
                  onClick={onSubmit}
                  onError={handleError}
                />
                <Button type="button" themeType="button-link" onClick={handleCancelButtonClick}>
                  Back
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

export default ViewOnlyTemplateForm;
