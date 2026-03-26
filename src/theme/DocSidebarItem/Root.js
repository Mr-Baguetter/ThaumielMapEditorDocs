import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

function useTableCodeTooltips() {
  const location = useLocation();

  useEffect(() => {
    const stamp = () => {
        document.querySelectorAll('table td code').forEach((el) => {
          el.removeAttribute('data-full');
      
          el.style.maxWidth = 'none';
          const naturalWidth = el.scrollWidth;
          el.style.maxWidth = '';
      
          if (naturalWidth > el.clientWidth) {
            el.setAttribute('data-full', el.textContent);
          }
        });
      };

    const raf = requestAnimationFrame(stamp);
    return () => cancelAnimationFrame(raf);

  }, [location.pathname]);
}

export default function Root({ children }) {
  useTableCodeTooltips();
  return <>{children}</>;
}