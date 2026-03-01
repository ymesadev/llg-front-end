"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Hide navbar on specific routes
  const hiddenRoutes = [
    "/american-integrity-claims",
    "/american-integrity-claims-attorneys",
    "/social-security-disability-attorneys",
    "/property-damage-claims-attorneys"
  ];
  
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }
  
  // Show Navbar on all other pages including live-chat
  return <Navbar />;
};

export default ConditionalNavbar;
