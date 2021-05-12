import classNames from 'classnames/bind';
import Link from 'next/link';

import Button from 'components/shared/button';

import DockerLogo from './images/docker.inline.svg';
import KubernetesLogo from './images/kubernetes.inline.svg';
import ReactLogo from './images/react.inline.svg';
import styles from './use-cases.module.scss';

const cx = classNames.bind(styles);

const items = [
  {
    logo: KubernetesLogo,
    name: 'With Kubernetes',
    description:
      'Create or use existing templates for your deployments, pods, certificates. Reduce changes of failures copypasting yaml files from previous project',
    url: '/',
  },
  {
    logo: DockerLogo,
    name: 'With Docker',
    description:
      'Create or use existing templates for your deployments, pods, certificates. Reduce changes of failures copypasting yaml files from previous project',
    url: '/',
  },
  {
    logo: ReactLogo,
    name: 'With React',
    description:
      'Create or use existing templates for your deployments, pods, certificates. Reduce changes of failures copypasting yaml files from previous project',
    url: '/',
  },
];

const UseCases = () => (
  <>
    <h2 className={cx('title')}>Use cases</h2>
    <ul>
      {items.map(({ logo: Logo, name, description, url }) => (
        <div className={cx('item')} key={name}>
          <div className={cx('item-header')}>
            <h3 className={cx('item-title')}>{name}</h3>
            <Logo />
          </div>
          <p className={cx('item-description')}>{description}</p>
          <Link href={url}>
            <Button tag="a" themeType="link" size="md">
              Learn more
            </Button>
          </Link>
        </div>
      ))}
    </ul>
  </>
);

export default UseCases;
