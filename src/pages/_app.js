// import '~antd/dist/antd.css';
import '../styles/globals.scss';
import { Provider } from 'next-auth/client';

function Snipsnap({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default Snipsnap;
