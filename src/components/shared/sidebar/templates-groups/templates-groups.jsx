import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { gql, useGqlClient } from 'api/graphql';
import Button from 'components/shared/button';
import IconButton from 'components/shared/icon-button';
import Input from 'components/shared/input';
import Modal from 'components/shared/modal';
import ModalPortal from 'components/shared/modal-portal';
import TemplatesGroupsTree from 'components/shared/templates-groups-tree';

import styles from './templates-groups.module.scss';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/[a-zA-Z| |-]+/, { message: "Name should contain only A-Za-z letters, space or '-'" }),
});
const cx = classNames.bind(styles);

const query = gql`
  mutation createTemplatesGroup($name: String!) {
    insert_template_groups_one(object: { name: $name }) {
      name
      owner_id
      id
    }
  }
`;

const TemplatesGroups = () => {
  const { register, handleSubmit, clearErrors, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gqlClient = useGqlClient();

  const onSubmit = async ({ name }) => {
    try {
      setLoading(true);
      await gqlClient.request(query, { name });
      setLoading(false);
      setIsModalOpen(false);
      mutate('getOwnedTemplateGroups');
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    clearErrors();
  };

  return (
    <div className={cx('templates')}>
      <h2>
        Template groups
        <IconButton
          icon="plus"
          className={cx('group-create-button')}
          onClick={() => setIsModalOpen(true)}
        />
        {isModalOpen && (
          <ModalPortal>
            <Modal
              title="Add group"
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input label="Name" name="name" register={register} errors={errors.name} />
                <Button className={cx('add-group-button')} type="submit" loading={loading}>
                  Add group
                </Button>
              </form>
            </Modal>
          </ModalPortal>
        )}
      </h2>
      <TemplatesGroupsTree />
    </div>
  );
};

export default TemplatesGroups;
