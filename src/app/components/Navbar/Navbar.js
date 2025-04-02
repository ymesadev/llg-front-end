"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Desktop submenu
  const [activeMobileMenu, setActiveMobileMenu] = useState(null); // Mobile submenu

  // Static nav links
  const navLinks = [
    {
      id: 1,
      label: "Property Damage",
      URL: "/property-damage-claims",
      subPages: [],
    },
    {
      id: 2,
      label: "Personal Injury",
      URL: "/personal-injury-attorneys",
      subPages: [],
    },
    {
      id: 3,
      label: "Social Security",
      URL: "/social-security-disability-lawyers",
      subPages: [],
    },
    {
      id: 4,
      label: "Our Team",
      URL: "/team",
      subPages: [],
    },
    {
      id: 5,
      label: "Resources",
      URL: "/resources",
      subPages: [],
    },
  ];

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavBackground(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveMobileMenu(null); // Reset submenus on open/close
  };

  const toggleSubMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const toggleMobileSubMenu = (id) => {
    setActiveMobileMenu(activeMobileMenu === id ? null : id);
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
          <ul>
            {navLinks.map((link) => (
              <li key={link.id} className={styles.navItem}>
                <div className={styles.navLink}>
                  <Link href={link.URL}>{link.label}</Link>
                  {link.subPages.length > 0 && (
                    <span
                      className={styles.arrowIcon}
                      onClick={() => toggleSubMenu(link.id)}
                    >
                      {activeMenu === link.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </div>
                {link.subPages.length > 0 && activeMenu === link.id && (
                  <ul className={styles.subMenu}>
                    {link.subPages.map((sub) => (
                      <li key={sub.id}>
                        <Link href={sub.URL}>{sub.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Phone number on desktop */}
        <div className={styles.phone}>
          <a href="tel:8336574812">+(833)-657-4812</a>
        </div>

        {/* Hamburger icon for mobile */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div
            className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
          <div
            className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
          <div
            className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}
          ></div>
        </div>
      </div>

      {/* Mobile Slide-In Menu */}
      <nav
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.show : ""}`}
      >
        <button className={styles.closeButton} onClick={toggleMenu}>
          ×
        </button>
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className={styles.navItem}>
              <div className={styles.navLink}>
                <Link href={link.URL}>{link.label}</Link>
                {link.subPages.length > 0 && (
                  <span
                    className={styles.arrowIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMobileSubMenu(link.id);
                    }}
                  >
                    {activeMobileMenu === link.id ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </span>
                )}
              </div>
              {link.subPages.length > 0 &&
                activeMobileMenu === link.id && (
                  <ul className={styles.subMenu}>
                    {link.subPages.map((sub) => (
                      <li key={sub.id}>
                        <Link href={sub.URL}>{sub.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}