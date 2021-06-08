import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import CloseIcon from 'icons/close.inline.svg';
import SearchIcon from 'icons/search.inline.svg';

import styles from './search.module.scss';

const cx = classNames.bind(styles);

const Search = ({ value, onChange }) => {
  const handleInputChange = (event) => onChange(event.currentTarget.value);
  const handleResetButtonClick = () => onChange('');

  return (
    <label className={cx('wrapper')}>
      <input
        className={cx('input')}
        type="text"
        placeholder="Find template..."
        value={value}
        onChange={handleInputChange}
      />
      <SearchIcon className={cx('icon')} />
      {value.length > 0 && (
        <button className={cx('reset')} type="button" onClick={handleResetButtonClick}>
          <CloseIcon />
        </button>
      )}
    </label>
  );
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Search;
