"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setNavBackground(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Mobile Menu
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`${styles.navbar} ${navBackground ? styles.navBackground : styles.transparent}`}>
      <div className={styles.navContainer}>
        {/* 1️⃣ Logo (Left) */}
        <div className={styles.logo}>
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>

       
        {/* 3️⃣ Desktop Navigation */}
        <nav className={styles.navLinks}>
          <ul>
            <li>
              <Link href="/property-damage-claims">Property Damage</Link>
            </li>
            <li>
              <Link href="/personal-injury-attorneys">Personal Injury</Link>
            </li>
            <li>
              <Link href="/social-security-disability-lawyers">Social Security</Link>
            </li>
            
            <li>
              <Link href="/team">Our Team</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
            <li>
              <Link href="/free-case-evaluation">Free Case Evaluation</Link>
            </li>
          </ul>
        </nav>
 {/* 2️⃣ Phone Number (In the middle only on mobile) */}
 <div className={styles.phone}>
          <a href="tel:8336574812">+(833)-657-4812</a>
        </div>

        {/* 4️⃣ Hamburger Menu (Right) */}
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}></div>
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}></div>
          <div className={`${styles.bar} ${mobileMenuOpen ? styles.open : ""}`}></div>
        </div>
      </div>

      {/* Mobile Slide-In Menu */}
      <nav className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.show : ""}`}>
        <button className={styles.closeButton} onClick={toggleMenu}>×</button>
        <ul>
          <li onClick={toggleMenu}>
            <Link href="/property-damage-claims">Property Damage</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link href="/personal-injury-attorneys">Personal Injury</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link href="/social-security-disability-lawyers">Social Security</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link href="/team">Our Team</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link href="/resources">Resources</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link href="/free-case-evaluation">Free Case Evaluation</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}