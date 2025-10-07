"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Hide navbar on live-chat page
  if (pathname === "/live-chat") {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar;
