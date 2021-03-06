import jwt from 'jsonwebtoken';
import { useContext } from 'react';
import useSWR, { mutate } from 'swr';

import AppContext from 'contexts/app-context';

const isExpired = (token) => {
  const payload = jwt.decode(token);
  const isExpired = payload.exp < Date.now() / 1000;
  return isExpired;
};

const fetchToken = async () => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/token`);
  const { token } = await result.json();
  return token;
};

const useToken = () => {
  const { token, setToken } = useContext(AppContext);

  const { data } = useSWR(() => (isExpired(token) ? 'token' : null), fetchToken, {
    initialData: token,
  });

  return { token: data, setToken };
};

export { useToken, isExpired, fetchToken };
