import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import useOutsideClick from 'hooks/use-outside-click';
import CloseSvg from 'icons/close.inline.svg';

import styles from './modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ title, children, isOpen, onRequestClose, theme, hasGradient }) => {
  const { register } = useOutsideClick(onRequestClose, isOpen);
  return (
    <div className={cx('wrapper', theme, { open: isOpen })}>
      <div className={cx('content-wrapper')}>
        <div className={cx('content', { withGradient: hasGradient })} ref={register}>
          <h2 className={cx('title')} dangerouslySetInnerHTML={{ __html: title }} />
          <div className={cx('body')}>{children}</div>
          {theme === 'grey' && <CloseSvg className={cx('close')} onClick={onRequestClose} />}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  theme: PropTypes.oneOf(['grey', 'transparent']),
  hasGradient: PropTypes.bool,
};

Modal.defaultProps = {
  theme: 'transparent',
  hasGradient: false,
};

export default Modal;
