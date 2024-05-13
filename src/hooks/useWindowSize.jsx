import { useState, useEffect } from "react";

export default function useWindowSize(debounceTime = 100) {
  const [size, setSize] = useState({ width: window.innerWidth });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => setSize({ width: window.innerWidth }),
        debounceTime
      );
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceTime]);

  return size;
}
