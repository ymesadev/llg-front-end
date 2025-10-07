"use client";

import { usePathname } from "next/navigation";
import Popup from "../Popup/Popup";

const ConditionalPopup = () => {
  const pathname = usePathname();
  
  // Hide Popup on live-chat page
  if (pathname === "/live-chat") {
    return null;
  }
  
  return <Popup />;
};

export default ConditionalPopup;
