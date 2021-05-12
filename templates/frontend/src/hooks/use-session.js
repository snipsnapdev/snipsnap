import { useContext } from 'react';

import AppContext from 'contexts/app-context';

const useSession = () => {
  const loading = false;
  const { session } = useContext(AppContext);
  return [session, loading];
};

export default useSession;
