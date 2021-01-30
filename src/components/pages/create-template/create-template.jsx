import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Input from 'components/shared/input';

import styles from './create-template.module.scss';
import Prompts from './prompts';

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

  return (
    <div>
      <div className={cx('left-column')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={cx('title')}>Create template</h1>
          <div className={cx('main')}>
            <Input label="Template name" name="name" register={register} errors={errors.name} />
          </div>
          <Prompts control={control} register={register} errors={errors} />
          <Button className={cx('create')} type="submit">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplate;
