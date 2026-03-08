"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import SearchBar from "./components/SearchBar/SearchBar";

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
        const sortedNav = data.data.sort((a, b) => a.Order - b.Order);
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
                  <Link href={link.URL} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search and Phone */}
        <div className={styles.rightSection}>
          <SearchBar />
          <a href="tel:8336574812" className={styles.phoneLink}>
            (833)657-4812
          </a>
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
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className={styles.mobileNavItem}>
              <Link href={link.URL} onClick={toggleMenu}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
