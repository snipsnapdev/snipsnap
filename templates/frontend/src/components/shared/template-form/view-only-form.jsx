import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useReducer, useContext } from 'react';

import AsyncButton from 'components/shared/async-button';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import { ErrorModalContext } from 'contexts/error-modal-context';
import { FilesContext, filesReducer } from 'contexts/files-provider';

import Files from './files';
import PromptsReadOnly from './prompts/prompts-read-only';
import styles from './template-form.module.scss';

const Editor = dynamic(import('components/shared/editor-wrapper'), { ssr: false });

const cx = classNames.bind(styles);

const ViewOnlyTemplateForm = ({ initialValues, onSave }) => {
  const { back } = useRouter();
  const { showErrorModal } = useContext(ErrorModalContext);

  const [filesState, dispatch] = useReducer(filesReducer, {
    files: initialValues.files,
    openFileId: null,
  });

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
                    readOnly
                    onChange={() => {}}
                  />
                </div>

                {initialValues.prompts.length > 0 && (
                  <div className={cx('prompts-wrapper')}>
                    <PromptsReadOnly prompts={initialValues.prompts} />
                  </div>
                )}
                <div className={cx('files-wrapper')}>
                  <Files readOnly />
                </div>
              </div>
              <div className={cx('buttons-wrapper')}>
                <AsyncButton
                  type="submit"
                  text="Clone"
                  successText="Cloned"
                  onClick={onSave}
                  onError={handleError}
                />
                <Button type="button" themeType="button-link" onClick={handleCancelButtonClick}>
                  Back
                </Button>
              </div>
            </form>
          </div>
          <div className={cx('right-column')}>
            <Editor readOnly />
          </div>
        </div>
      </div>
    </FilesContext.Provider>
  );
};

export default ViewOnlyTemplateForm;
