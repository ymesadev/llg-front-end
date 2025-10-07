"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Show Navbar on all pages including live-chat
  return <Navbar />;
};

export default ConditionalNavbar;
