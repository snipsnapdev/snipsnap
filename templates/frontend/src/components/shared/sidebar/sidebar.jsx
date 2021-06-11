import React from 'react';

import useSession from 'hooks/use-session';

import AuthorisedSidebar from './authorised-sidebar';
import UnauthorisedSidebar from './unauthorised-sidebar';

const Sidebar = () => {
  const [session = {}] = useSession();

  const { user } = session;

  if (user) return <AuthorisedSidebar />;
  return <UnauthorisedSidebar />;
};

export default Sidebar;
