import React from 'react';

const AppContext = React.createContext({
  session: undefined,
  token: undefined,
});

export default AppContext;
