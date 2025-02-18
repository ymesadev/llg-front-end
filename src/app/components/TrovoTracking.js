"use client";
import { useEffect } from "react";

export default function TrovoTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it only runs on the client

    const pageUrl = window.location.pathname.toLowerCase();

    let iframeSrc = "";
    if (pageUrl.includes("personal-injury-attorneys")) {
      iframeSrc = "https://tag.trovo-tag.com/bfa71da2acc57ee351090f626d3b2396";
    } else if (pageUrl.includes("property-damage-claims")) {
      iframeSrc = "https://tag.trovo-tag.com/e71d7a9cd013c233d1a2ebff067d8d82";
    } else if (pageUrl.includes("social-security-disability-lawyers")) {
      iframeSrc = "https://tag.trovo-tag.com/e015a6a5d16e70cfc04c12d5d6aeab9b";
    } else if (pageUrl.includes("team")) {
      iframeSrc = "https://tag.trovo-tag.com/19f73f602d97d978bddd4d829827d55a";
    } else if (pageUrl === "/") { 
      iframeSrc = "https://tag.trovo-tag.com/35213da7953fdbb90854482c72852d7e";
    }

    if (iframeSrc) {
      const iframe = document.createElement("iframe");
      iframe.src = iframeSrc;
      iframe.width = "1";
      iframe.height = "1";
      iframe.style.position = "absolute";
      iframe.style.visibility = "hidden";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
  }, []);

  return null;
}