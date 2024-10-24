import { useState, useEffect } from "react";

export const useLocalStorageState = (initialState, key) => {
  /*  
   loading watched with inital data from localStorage
   function in the useState() needs to a pure function, which means no argument
   this will only be look at by React when component first mounts
*/
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  // Updating(add/delete) localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
