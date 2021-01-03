import React from 'react';

import styles from './icon-button.module.scss';

const IconButton = (props) => {
  const { className: additionalClassName, theme, size, ...otherProps } = props;
  return <button />;
};

IconButton.propTypes = {
  className: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm']),
  icon: PropTypes.oneOf(['plus']).isRequired,
};

IconButton.defaultProps = {
  className: null,
  theme: 'primary',
  size: 'sm',
};

export default IconButton;
