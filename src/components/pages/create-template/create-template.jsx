import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
// import { useTemplateGroups } from 'contexts/template-groups-provider';
import TemplateStore, { TemplateStoreContext } from 'stores/template-store';

import styles from './create-template.module.scss';
import Files from './files';
import Prompts from './prompts';

const Editor = dynamic(import('components/editor'), { ssr: false });

const cx = classNames.bind(styles);

const promptsSchema = {
  message: yup.string().required('Message is required'),
  variableName: yup.string().required('Variable name is required'),
};

const query = gql`
  mutation createTemplate(
    $name: String!
    $prompts: jsonb!
    $files: jsonb!
    $templateGroupId: uuid
  ) {
    insert_templates_one(
      object: { name: $name, files: $files, prompts: $prompts, template_group_id: $templateGroupId }
    ) {
      name
      owner_id
      files
      prompts
      id
    }
  }
`;

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

const CreateTemplate = (props) => {
  const gqlClient = useGqlClient();
  const { register, control, handleSubmit, clearErrors, errors } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      prompts: [],
    },
  });

  // const groups = useTemplateGroups();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ name, prompts }) => {
    const filesForApi = templateStore.formatFilesDataForApi();

    try {
      setIsLoading(true);
      await gqlClient.request(query, {
        name,
        prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
        files: JSON.stringify(filesForApi),
        // @TODO: change to selected group after group select is added
        // templateGroupId: groups[0].id,
      });
      setIsLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    clearErrors();
  };

  const templateStore = React.useMemo(() => new TemplateStore(), []);

  // add mock data for testing
  // React.useEffect(() => {
  //   const file1 = templateStore.addFile({ name: 'foo.js', content: 'const a = 10;' });
  //   templateStore.addFile({ name: 'bar.ts', content: 'let a: number = 5;' });
  //   const folder1 = templateStore.addFolder({ name: 'folder', files: [] });
  //   templateStore.addFile({ name: 'test.css', content: '.text {color: red;}' }, folder1.id);
  //   templateStore.addFile(
  //     { name: 'test.html', content: '<h1 class="title">Test</h1>' },
  //     folder1.id
  //   );
  //   const folder2 = templateStore.addFolder({ name: 'inside', files: [] }, folder1.id);
  //   templateStore.addFile(
  //     { name: 'test.html', content: '<h1 class="title">Test</h1>' },
  //     folder2.id
  //   );
  //   templateStore.openFile(file1.id);
  // }, [templateStore]);

  return (
    <TemplateStoreContext.Provider value={templateStore}>
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
            <div className={cx('files-wrapper')}>
              <Files />
            </div>
            <Button className={cx('create')} type="submit" loading={isLoading}>
              Create
            </Button>
          </form>
        </div>
        <div className={cx('right-column')}>
          <Editor />
        </div>
      </div>
    </TemplateStoreContext.Provider>
  );
};

export default CreateTemplate;
