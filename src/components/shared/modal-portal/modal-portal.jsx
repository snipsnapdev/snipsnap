import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  const el = useRef(null);
  const mount = document.getElementById('modal');
  if (!el.current) el.current = document.createElement('div');
  useEffect(() => {
    mount.appendChild(el.current);
    return () => mount.removeChild(el.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(children, el.current);
};

export default ModalPortal;
