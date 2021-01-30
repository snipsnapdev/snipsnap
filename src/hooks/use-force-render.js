import React from 'react';

const useForceRender = () => {
  const [, setRenderKey] = React.useState(0);
  return () => setRenderKey((key) => key + 1);
};

export default useForceRender;
