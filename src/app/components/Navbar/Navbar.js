"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import styles from "./Navbar.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import { NavArrowButton } from "../../../../public/icons";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); // Desktop submenu
  const [activeMobileMenu, setActiveMobileMenu] = useState(null); // Mobile submenu
  const router = useRouter();
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
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/navigations?populate=children`
        );
        if (!response.ok) throw new Error("Failed to fetch navigation links");

        const data = await response.json();
        console.log("🔍 Fetched Navigation Data:", data);

        // Sort navigation by "Order"
        const sortedNav = data.data.sort((a, b) => a.Order - b.Order);

        setNavLinks(sortedNav);
      } catch (error) {
        console.error("❌ Error fetching navigation:", error);
      }
    };

    fetchNavLinks();
  }, []);

  // Toggle the mobile menu open/closed
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveMobileMenu(null); // Reset submenus on open/close
  };

  // Toggle a submenu in desktop
  const toggleSubMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Toggle a submenu in mobile
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
                  <div className={styles.navLink}>
                    <Link href={link.URL}>
                      {link.label}
                      {link.children.length > 0 && (
                        <span className={styles.arrowIcon}>
                          <NavArrowButton />
                        </span>
                      )}
                    </Link>
                  </div>
                  {link.children.length > 0 && (
                    <div className={styles.subMenu}>
                      <div></div>
                      <ul>
                        {link.children.map((sub) => (
                          <li key={sub.id}>
                            <Link href={`${link.URL}/${sub.Slug}`}>
                              {sub.submenu_title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Phone number on desktop */}
        <div className={styles.phone}>
          {navLinks?.length > 0 && <SearchBar />}
          <a href="tel:8336574812">(833)657-4812</a>
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
                {/* Separate the link and the arrow toggle */}
                <Link href={link.URL}>{link.label}</Link>
                {link.children.length > 0 && (
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
              {link.children.length > 0 && activeMobileMenu === link.id && (
                <ul className={styles.subMenu}>
                  {link.children.map((sub) => (
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
