import { useEffect, useRef, useCallback } from 'react';

function useOutsideClick(handler, when = true) {
  const ref = useRef();
  const savedHandler = useRef(handler);

  function register(nodeRef) {
    if (!nodeRef) {
      return;
    }
    ref.current = nodeRef;
  }

  const memoizedCallback = useCallback((e) => {
    if (ref && ref.current && !ref.current.contains(e.target)) {
      savedHandler.current(e);
    }
  }, []);
  useEffect(() => {
    savedHandler.current = handler;
  });
  useEffect(() => {
    if (when) {
      document.addEventListener('click', memoizedCallback);
      document.addEventListener('ontouchstart', memoizedCallback);
      return () => {
        document.removeEventListener('click', memoizedCallback);
        document.removeEventListener('ontouchstart', memoizedCallback);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handler, when]);

  return {
    register,
  };
}
export default useOutsideClick;
