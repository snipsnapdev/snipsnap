import '../styles/globals.scss';
import React from 'react';

import AppContext from 'contexts/app-context';

function Snipsnap({ Component, pageProps }) {
  const [token, setToken] = React.useState(pageProps.token);
  console.log('Snipsnap.render');
  return (
    <AppContext.Provider value={{ session: pageProps.session, token, setToken }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default Snipsnap;
