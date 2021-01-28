import '../styles/globals.scss';
import { Provider } from 'next-auth/client';

function Snipsnap({ Component, pageProps }) {
  console.log(pageProps);
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default Snipsnap;
