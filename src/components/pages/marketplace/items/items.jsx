import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Avatar from 'components/shared/avatar';
import Button from 'components/shared/new-button';

import styles from './items.module.scss';

const cx = classNames.bind(styles);

const Items = ({ searchText, items }) => {
  const filteredItems = searchText
    ? items.filter(({ name, owner }) => {
        const searchWords = searchText.toLowerCase().trim().split(' ');
        return searchWords.every(
          (searchWord) =>
            name.toLowerCase().includes(searchWord.trim()) ||
            owner.name.toLowerCase().includes(searchWord.trim())
        );
      })
    : items;

  return (
    <div className={cx('wrapper')}>
      {filteredItems.map(({ id, name, owner }) => (
        <div className={cx('item')} key={id}>
          <h3 className={cx('item-name')}>{name}</h3>
          <div className={cx('item-footer')}>
            <div className={cx('item-author')}>
              <Avatar
                className={cx('item-author-avatar')}
                avatar={owner.image}
                userName={owner.name}
              />
              <span>{owner.name}</span>
            </div>
            <Button themeType="link" size="md">
              Clone
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

Items.propTypes = {
  searchText: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      owner: {
        name: PropTypes.string,
        image: PropTypes.string,
      },
    })
  ),
};

Items.defaultProps = {
  searchText: '',
  items: [],
};

export default Items;
