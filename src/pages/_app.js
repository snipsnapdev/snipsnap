import '../styles/globals.scss';
import React from 'react';

import AppContext from 'contexts/app-context';

// import TemplateGroupsProvider from 'contexts/template-groups-provider';

function Snipsnap({ Component, pageProps }) {
  const [token, setToken] = React.useState(pageProps.token);
  return (
    <AppContext.Provider value={{ session: pageProps.session, token, setToken }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default Snipsnap;
