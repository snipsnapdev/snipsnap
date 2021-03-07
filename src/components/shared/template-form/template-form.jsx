import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { typeFromAST } from 'graphql';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import Input from 'components/shared/input';
import { useTemplateGroups } from 'contexts/template-groups-provider';
import TemplateStore, { TemplateStoreContext } from 'stores/template-store';

import Files from './files';
import Prompts from './prompts';
import styles from './template-form.module.scss';

const Editor = dynamic(import('components/editor'), { ssr: false });

const cx = classNames.bind(styles);

const findTemplateById = (templateId, groups) => {
  let template = null;
  for (const group of groups) {
    template = group.templates.find((item) => item.id === templateId);
    if (typeof template !== 'undefined') {
      return template;
    }
  }

  return template;
};

const promptsSchema = {
  message: yup.string().required('Message is required'),
  variableName: yup.string().required('Variable name is required'),
};

const createTemplateQuery = gql`
  mutation createTemplate(
    $name: String!
    $prompts: jsonb!
    $files: jsonb!
    $templateGroupId: uuid!
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

const updateTemplateQuery = gql`
  mutation updateTemplate(
    $templateId: uuid!
    $name: String!
    $prompts: jsonb!
    $files: jsonb!
    $templateGroupId: uuid!
  ) {
    update_templates_by_pk(
      pk_columns: { id: $templateId }
      _set: { name: $name, files: $files, prompts: $prompts, template_group_id: $templateGroupId }
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

const defaultTemplateValues = {
  name: '',
  prompts: [],
  files: [],
};

const TemplateForm = ({ templateId = null }) => {
  console.log('CT rerender', templateId);
  const groups = useTemplateGroups();

  console.log('GROUPS', groups);

  const { register, control, handleSubmit, reset, clearErrors, errors } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: defaultTemplateValues,
  });

  const isCreatingNewTemplate = !templateId;

  useEffect(() => {
    const template = !templateId ? null : findTemplateById(templateId, groups);
    console.log('FOUND', template);
    const templateData = !templateId
      ? defaultTemplateValues
      : {
          name: template?.name || '',
          prompts: template?.prompts ? JSON.parse(template.prompts) : [],
          files: template?.files ? JSON.parse(template.files) : [],
        };

    console.log('reset to', templateData);
    reset(templateData);
  }, [templateId, reset, groups]);

  const gqlClient = useGqlClient();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ name, prompts }) => {
    const filesForApi = templateStore.formatFilesDataForApi();

    try {
      setIsLoading(true);

      if (isCreatingNewTemplate) {
        await gqlClient.request(createTemplateQuery, {
          name,
          prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
          files: JSON.stringify(filesForApi),
          // @TODO: change to selected group after group select is added
          templateGroupId: groups[0].id,
        });
      } else {
        await gqlClient.request(updateTemplateQuery, {
          templateId,
          name,
          prompts: JSON.stringify(typeof prompts !== 'undefined' ? prompts : []),
          files: JSON.stringify(filesForApi),
          // @TODO: change to selected group after group select is added
          templateGroupId: groups[0].id,
        });
      }
      setIsLoading(false);
      mutate('getOwnedTemplatesGroups');
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    clearErrors();
  };

  // FIND FILES FOR CURRENT TEMPLATE (TODO: update to local state)
  const template = !templateId ? null : findTemplateById(templateId, groups);
  console.log('FOUND', template);
  const templateData = !templateId
    ? defaultTemplateValues
    : {
        name: template?.name || '',
        prompts: template?.prompts ? JSON.parse(template.prompts) : [],
        files: template?.files ? JSON.parse(template.files) : [],
      };

  const templateStore = React.useMemo(() => new TemplateStore(templateData.files), [
    templateData.files,
  ]);

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
            <h1 className={cx('title')}>
              {isCreatingNewTemplate ? 'Create template' : 'Edit template'}
            </h1>
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
              {isCreatingNewTemplate ? 'Create' : 'Save'}
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

export default TemplateForm;
