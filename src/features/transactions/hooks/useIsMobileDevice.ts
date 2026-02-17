import { useEffect, useState } from "react";

const useIsMobileDevice = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent;

    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

    setIsMobileDevice(isMobile);
  }, []);

  return isMobileDevice;
};

export { useIsMobileDevice };
