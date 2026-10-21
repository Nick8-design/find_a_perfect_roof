import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouterContext = createContext();

// Normalize paths: remove trailing slash except for root '/'
function normalizePath(path) {
  if (!path) return '/';
  const clean = path.trim().split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1);
  }
  return clean || '/';
}

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  const navigate = useCallback((to, options = {}) => {
    const { replace = false } = options;
    const targetPath = normalizePath(to);

    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState(null, '', targetPath);
      } else {
        window.history.pushState(null, '', targetPath);
      }
    }
    setCurrentPath(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

