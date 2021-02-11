import '../styles/globals.scss';

import AppContext from 'contexts/app-context';

function Snipsnap({ Component, pageProps }) {
  return (
    <AppContext.Provider value={{ session: pageProps.session, token: pageProps.token }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default Snipsnap;
