import classNames from 'classnames/bind';

import styles from './curated-collections.module.scss';
import Items from './items';

const cx = classNames.bind(styles);

const items = [
  {
    id: '0',
    name: 'React Component',
    imageName: 'docker',
    numberOfTemplates: 23,
  },
  {
    id: '1',
    name: 'Kubernetes',
    imageName: 'kubernetes',
    numberOfTemplates: 23,
  },
  {
    id: '2',
    name: 'Docker',
    imageName: 'docker',
    numberOfTemplates: 23,
  },
  {
    id: '3',
    name: 'Node.js – Express, Koa, Nuxt, Fastify',
    imageName: 'nodejs',
    numberOfTemplates: 23,
  },
  {
    id: '4',
    name: 'Tailwind UI',
    imageName: 'tailwindui',
    numberOfTemplates: 23,
  },
];

const CuratedCollections = () => (
  <div className={cx('wrapper')}>
    <h3 className={cx('title')}>
      <img width={30} src="/images/rock.png" alt="" aria-hidden />
      <span>Curated collections</span>
    </h3>
    <Items items={items} />
  </div>
);

export default CuratedCollections;
