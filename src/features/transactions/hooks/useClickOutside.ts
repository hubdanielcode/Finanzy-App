import { useEffect, type RefObject } from "react";

const useClickOutside = (
  ref: RefObject<HTMLDivElement | null>,
  setIsOpen: (isOpen: boolean) => void,
) => {
  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAnywhere);
    return () => document.removeEventListener("mousedown", handleClickAnywhere);
  }, [ref, setIsOpen]);
};
export { useClickOutside };
