import '../styles/globals.scss';

import React from 'react';

import AppContext from 'contexts/app-context';
import { ErrorModalProvider } from 'contexts/error-modal-context';
import { OpenGroupsProvider } from 'contexts/open-groups-context';
import TemplateGroupsProvider from 'contexts/template-groups-provider';

function Snipsnap({ Component, pageProps }) {
  const [token, setToken] = React.useState(pageProps.token);
  return (
    <AppContext.Provider value={{ session: pageProps.session, token, setToken }}>
      <ErrorModalProvider>
        <OpenGroupsProvider>
          <TemplateGroupsProvider>
            <Component {...pageProps} />
          </TemplateGroupsProvider>
        </OpenGroupsProvider>
      </ErrorModalProvider>
    </AppContext.Provider>
  );
}

export default Snipsnap;
