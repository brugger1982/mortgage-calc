import { useState, useEffect, useCallback } from 'react';

export function useUrlState(key, initialValue) {
  const [state, setState] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get(key);
    if (value !== null) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (e) {
        return decodeURIComponent(value);
      }
    }
    return initialValue;
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (state === initialValue || state === '' || state === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, encodeURIComponent(JSON.stringify(state)));
    }
    
    const queryString = searchParams.toString();
    const newRelativePathQuery = window.location.pathname + (queryString ? '?' + queryString : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [key, state, initialValue]);

  return [state, setState];
}
