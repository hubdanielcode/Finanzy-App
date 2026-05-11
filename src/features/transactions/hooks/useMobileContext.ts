import { useContext } from "react";
import { MobileContext } from "../context/MobileContext";

const useMobileContext = () => {
  const context = useContext(MobileContext);

  if (!context) {
    throw new Error("useMobileContext must be used within a MobileProvider");
  }

  return context;
};

export { useMobileContext };
