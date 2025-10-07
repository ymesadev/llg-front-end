"use client";

import { usePathname } from "next/navigation";
import Footer from "../Footer/Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Show Footer on all pages including live-chat
  return <Footer />;
};

export default ConditionalFooter;
