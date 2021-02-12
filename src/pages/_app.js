import '../styles/globals.scss';

import { Provider } from 'next-auth/client';

import TemplateGroupsProvider from 'contexts/template-groups-provider';

function Snipsnap({ Component, pageProps }) {
  console.log(pageProps);
  return (
    <Provider session={pageProps.session}>
      <TemplateGroupsProvider>
        <Component {...pageProps} />
      </TemplateGroupsProvider>
    </Provider>
  );
}

export default Snipsnap;
