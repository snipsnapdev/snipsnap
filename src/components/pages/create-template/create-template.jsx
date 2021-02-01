import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import FileBrowser from 'components/file-browser';
import Button from 'components/shared/button';
import Dropdown from 'components/shared/dropdown';
import IconButton from 'components/shared/icon-button';
import Input from 'components/shared/input';

import styles from './create-template.module.scss';
import Prompts from './prompts';

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
    .compact((v) => v.message === '' && v.variableName === '')
    .required(),
});

const CreateTemplate = (props) => {
  const { register, control, handleSubmit, errors } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);

  const addMenu = (
    <>
      <div onClick={() => setIsAddFileModalOpen(true)}>Add File</div>
      <div onClick={() => setIsAddFolderModalOpen(true)}>Add Folder</div>
    </>
  );

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left-column')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={cx('title')}>Create template</h1>
          <div className={cx('main')}>
            <Input label="Template name" name="name" register={register} errors={errors.name} />
          </div>
          <div className={cx('prompts-wrapper')}>
            <Prompts control={control} register={register} errors={errors} />
          </div>
          <div className={cx('file-browser-wrapper')}>
            <div className={cx('file-browser-head')}>
              <h2 className={cx('file-browser-title')}>Files</h2>
              <div className={cx('add-options')}>
                <Dropdown
                  menu={addMenu}
                  className={cx('add-options-inner')}
                  position="top-left"
                  stopPropagation
                >
                  <IconButton icon="plus" className={cx('add-button')} />
                </Dropdown>
              </div>
            </div>
            <FileBrowser />
          </div>
          <Button className={cx('create')} type="submit">
            Create
          </Button>
        </form>
      </div>
      <div className={cx('right-column')}>
        <Editor />
      </div>
    </div>
  );
};

export default CreateTemplate;
