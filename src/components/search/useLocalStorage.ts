import { useState, useEffect } from "react";

const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Check if localStorage is available in the current environment
      const storedValue = JSON.parse(localStorage.getItem(key));
      if (storedValue !== null) {
        setValue(storedValue);
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Check if localStorage is available in the current environment
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
