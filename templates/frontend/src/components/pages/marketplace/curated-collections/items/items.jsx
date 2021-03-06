import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

import DockerLogo from './images/docker.inline.svg';
import KubernetesLogo from './images/kubernetes.inline.svg';
import NodejsLogo from './images/nodejs.inline.svg';
import ReactjsLogo from './images/reactjs.inline.svg';
import TailwinduiLogo from './images/tailwindui.inline.svg';
import styles from './items.module.scss';

const cx = classNames.bind(styles);

const images = {
  docker: DockerLogo,
  kubernetes: KubernetesLogo,
  nodejs: NodejsLogo,
  reactjs: ReactjsLogo,
  tailwindui: TailwinduiLogo,
};

const Items = ({ items }) => {
  const router = useRouter();

  return (
    <div className={cx('wrapper')}>
      {items.map(({ id, name, image_name, slug, templates }) => {
        const Image = images[image_name];

        return (
          <div
            className={cx('item')}
            key={id}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              router.push(`/marketplace/${slug}`);
            }}
          >
            <div className={cx('item-header')}>
              <h3 className={cx('item-name')}>{name}</h3>
              <Image className={cx('item-image')} />
            </div>
            <Button className={cx('item-number')} themeType="link" size="md">
              {templates.length} {templates.length === 1 ? 'template' : 'templates'}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

Items.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      prompts: PropTypes.string,
      files: PropTypes.string,
      owner: {
        name: PropTypes.string,
        image: PropTypes.string,
      },
    })
  ),
};

Items.defaultProps = {
  items: [],
};

export default Items;
