import classNames from 'classnames/bind';
import { signIn } from 'next-auth/client';

import shape1 from './images/shape-1.svg';
import shape2 from './images/shape-2.svg';
import shape3 from './images/shape-3.svg';
import shape4 from './images/shape-4.svg';

import styles from './login.module.scss';

const cx = classNames.bind(styles);

export default function Login() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('card')}>
        <p className={cx('description')}>Welcom to</p>
        <h1 className={cx('title')}>Snipsnap - Scaffold</h1>

        <button className={cx('button')} onClick={() => signIn('github')}>
          <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5528 0.960137C8.86217 0.957404 6.25847 1.91266 4.20834 3.65471C2.15821 5.39676 0.795656 7.81174 0.364849 10.4669C-0.0659581 13.122 0.463146 15.8437 1.85734 18.1443C3.25154 20.4449 5.41969 22.1739 7.97326 23.0215C8.54321 23.1258 8.74478 22.7714 8.74478 22.4726C8.74478 22.1738 8.74478 21.4929 8.74478 20.5479C5.58225 21.2358 4.91499 19.0262 4.91499 19.0262C4.70519 18.3413 4.25947 17.753 3.65693 17.3655C2.63519 16.6706 3.74034 16.6706 3.74034 16.6706C4.0985 16.7212 4.44046 16.8526 4.74031 17.0548C5.04016 17.2571 5.29005 17.5249 5.47104 17.838C5.62483 18.1167 5.83217 18.3624 6.08117 18.5609C6.33016 18.7593 6.61591 18.9067 6.92201 18.9945C7.22811 19.0823 7.54854 19.1088 7.86492 19.0725C8.1813 19.0362 8.48739 18.9378 8.76563 18.783C8.80925 18.2113 9.05576 17.6741 9.46069 17.2682C6.94457 16.9833 4.30334 16.0105 4.30334 11.7094C4.28606 10.5858 4.70166 9.49865 5.46409 8.67294C5.12452 7.696 5.16421 6.62722 5.5753 5.67815C5.5753 5.67815 6.52753 5.37242 8.68917 6.83854C10.5454 6.32905 12.5046 6.32905 14.3609 6.83854C16.5225 5.37242 17.4678 5.67815 17.4678 5.67815C17.8846 6.61718 17.9342 7.67829 17.6068 8.65209C18.3692 9.4778 18.7848 10.565 18.7676 11.6886C18.7676 16.0383 16.1194 16.9903 13.5963 17.2473C13.8668 17.5192 14.0758 17.8461 14.2089 18.2057C14.342 18.5654 14.3962 18.9495 14.3678 19.3319C14.3678 20.8467 14.3678 22.0696 14.3678 22.4379C14.3678 22.8061 14.5694 23.091 15.1463 22.9798C17.6708 22.1098 19.8065 20.3759 21.176 18.0843C22.5456 15.7927 23.0609 13.0909 22.631 10.4563C22.201 7.82162 20.8535 5.42367 18.8263 3.68604C16.7992 1.94841 14.223 0.982921 11.5528 0.960137Z"
              fill="white"
            />
          </svg>
          login with github
        </button>
      </div>

      <img className={cx('shape', 'shape-1')} src={shape1} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-2')} src={shape2} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-3')} src={shape3} loading="lazy" alt="" aria-hidden />
      <img className={cx('shape', 'shape-4')} src={shape4} loading="lazy" alt="" aria-hidden />
    </div>
  );
}
