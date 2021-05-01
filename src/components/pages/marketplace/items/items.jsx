import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Avatar from 'components/shared/avatar';
import Button from 'components/shared/new-button';

import styles from './items.module.scss';

const cx = classNames.bind(styles);

const mockItems = [
  {
    id: 0,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 1,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 2,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 3,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 4,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 5,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 6,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 7,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 8,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 9,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 10,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 11,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 12,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 13,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 14,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 15,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 16,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 17,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 18,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 19,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 20,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 21,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
  {
    id: 22,
    name: 'Kubernetes',
    isCloned: false,
    user: {
      name: 'Max Gorodov',
      image: 'https://avatars.githubusercontent.com/u/20713191?v=4',
    },
  },
  {
    id: 23,
    name: 'Create React Component',
    isCloned: true,
    user: {
      name: 'Alex Barashkov',
      image: 'https://avatars.githubusercontent.com/u/2697570?v=4',
    },
  },
];

const Items = ({ searchText }) => {
  const filteredItems = searchText
    ? mockItems.filter(({ name, user }) => {
        const searchWords = searchText.toLowerCase().trim().split(' ');
        return searchWords.every(
          (searchWord) =>
            name.toLowerCase().includes(searchWord.trim()) ||
            user.name.toLowerCase().includes(searchWord.trim())
        );
      })
    : mockItems;

  return (
    <div className={cx('wrapper')}>
      {filteredItems.map(({ id, name, isCloned, user }) => (
        <div className={cx('item')} key={id}>
          <h3 className={cx('item-name')}>{name}</h3>
          <div className={cx('item-footer')}>
            <div className={cx('item-author')}>
              <Avatar
                className={cx('item-author-avatar')}
                avatar={user.image}
                userName={user.name}
              />
              <span>{user.name}</span>
            </div>
            {isCloned ? (
              <span className={cx('item-cloned')}>Cloned</span>
            ) : (
              <Button themeType="link" size="md">
                Clone
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

Items.propTypes = {
  searchText: PropTypes.string,
};

Items.defaultProps = {
  searchText: '',
};

export default Items;
