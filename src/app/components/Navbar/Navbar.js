"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [activeMobileMenu, setActiveMobileMenu] = useState(null); 

  // Handle scrolling effect
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
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/navigations?populate=parent`
        );
        if (!response.ok) throw new Error("Failed to fetch navigation links");

        const data = await response.json();
        console.log("🔍 Fetched Navigation Data:", data);

        // Sort navigation by "Order"
        const sortedNav = data.data.sort((a, b) => a.Order - b.Order);

        // Build a menu tree (main items + sub-pages)
        const menuItems = sortedNav.reduce((acc, item) => {
          if (item.parent.length === 0) {
            // top-level item
            acc[item.id] = { ...item, subPages: [] };
          } else {
            // sub-page
            const parentId = item.parent[0].id;
            if (acc[parentId]) {
              acc[parentId].subPages.push(item);
            }
          }
          return acc;
        }, {});
        setNavLinks(Object.values(menuItems));
      } catch (error) {
        console.error("❌ Error fetching navigation:", error);
      }
    };

    fetchNavLinks();
  }, []);

  // Toggle Mobile Menu
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveMobileMenu(null); // Close submenus when toggling
  };

  // Toggle Submenu (Desktop)
  const toggleSubMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Toggle Submenu (Mobile)
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
                <div
                  className={styles.navLink}
                  onClick={() => toggleSubMenu(link.id)}
                >
                  <Link href={link.URL}>{link.label}</Link>
                  {link.subPages.length > 0 && (
                    <span className={styles.arrowIcon}>
                      {activeMenu === link.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </div>

                {/* Only render subPages if active */}
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

        {/* Phone Button (Desktop) */}
        <div className={styles.phone}>
          <a href="tel:8336574812">+(833)-657-4812</a>
        </div>

        {/* Hamburger Icon (Mobile) */}
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
              <div
                className={styles.navLink}
                onClick={() => toggleMobileSubMenu(link.id)}
              >
                {link.label}
                {link.subPages.length > 0 && (
                  <span className={styles.arrowIcon}>
                    {activeMobileMenu === link.id ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </span>
                )}
              </div>
              {/* Only render subPages if active */}
              {link.subPages.length > 0 && activeMobileMenu === link.id && (
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