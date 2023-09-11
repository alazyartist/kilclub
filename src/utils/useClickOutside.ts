import { type RefObject, useEffect } from "react";

const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  callback: () => void,
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current?.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useClickOutside;
