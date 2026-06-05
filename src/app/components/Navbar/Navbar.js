"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import AskAI from "../AskAI/AskAI";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const pathname = usePathname();

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavBackground(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch navigation links from Strapi
  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/navigations?populate=pages`
        );
        if (!response.ok) throw new Error("Failed to fetch navigation links");

        const data = await response.json();
        const hiddenLabels = ["faq", "free case evaluation"];
        const sortedNav = data.data
          .sort((a, b) => a.Order - b.Order)
          .filter((link) => !hiddenLabels.includes(link.label.toLowerCase()));

        // Family Law lives on a separate site (family.louislawgroup.com) and is
        // not part of the Strapi navigation, so inject it manually right after
        // "Social Security" (i.e. between Social Security and Privacy Torts).
        const familyLaw = {
          id: "family-law-external",
          label: "Family Law",
          URL: "https://family.louislawgroup.com/",
          external: true,
        };
        if (
          !sortedNav.some((link) => link.label?.toLowerCase() === "family law")
        ) {
          const ssIndex = sortedNav.findIndex(
            (link) => link.label?.toLowerCase() === "social security"
          );
          if (ssIndex !== -1) {
            sortedNav.splice(ssIndex + 1, 0, familyLaw);
          } else {
            sortedNav.push(familyLaw);
          }
        }

        setNavLinks(sortedNav);
      } catch (error) {
        console.error("❌ Error fetching navigation:", error);
      }
    };

    fetchNavLinks();
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`${styles.navbar} ${
        navBackground ? styles.navBackground : styles.transparent
      }`}
    >
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.navLinks}>
          <ul className={styles.navLinksWrapper}>
            {navLinks.map((link) => {
              const isActive = pathname === link.URL;
              return (
                <li
                  key={link.id}
                  className={`${styles.navItem} ${
                    isActive ? styles.activeNavItem : ""
                  }`}
                >
                  {link.external ? (
                    <a href={link.URL} className={styles.navLink}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.URL} className={styles.navLink}>
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Ask AI */}
        <div className={styles.rightSection}>
          <AskAI />
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton} onClick={toggleMenu}>
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`} />
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <nav className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.show : ""}`}>
        <button className={styles.closeButton} onClick={toggleMenu}>
          ×
        </button>
        <div className={styles.mobileAskAi}>
          <AskAI />
        </div>
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className={styles.mobileNavItem}>
              {link.external ? (
                <a href={link.URL} onClick={toggleMenu}>
                  {link.label}
                </a>
              ) : (
                <Link href={link.URL} onClick={toggleMenu}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
