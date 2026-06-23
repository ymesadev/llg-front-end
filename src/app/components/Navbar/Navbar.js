"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import AskAI from "../AskAI/AskAI";
import QualifyDropdown from "../QualifyDropdown/QualifyDropdown";

export default function Navbar() {
  const [navBackground, setNavBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const pathname = usePathname();

  const isES = /\b(abogado|abogados|discapacidad|calificar|reclamos-propiedad|seguro-social|negaron)\b/.test(pathname || "");

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
        const hiddenLabels = ["faq", "free case evaluation", "resources", "personal injury"];
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

        // Warranty claims is a coded practice-area page (not yet in the Strapi
        // navigation), so inject it manually right after "Property Damage".
        const warranty = {
          id: "warranty-claims-internal",
          label: "Warranty",
          URL: "/warranty-claims",
          external: false,
          children: [
            {
              id: "warranty-claims",
              label: "Warranty Claims",
              URL: "/warranty-claims",
              external: false,
            },
            {
              id: "warranty-arbitration",
              label: "Warranty Arbitration",
              URL: "/warranty-claims/arbitration",
              external: false,
            },
          ],
        };
        if (!sortedNav.some((link) => link.label?.toLowerCase() === "warranty")) {
          const pdIndex = sortedNav.findIndex((link) =>
            (link.label?.toLowerCase() || "").includes("property damage")
          );
          if (pdIndex !== -1) {
            sortedNav.splice(pdIndex + 1, 0, warranty);
          } else {
            sortedNav.push(warranty);
          }
        }

        // Contract Dispute is a coded practice-area page (not yet in the Strapi
        // navigation), so inject it manually right after "Warranty".
        const contractDispute = {
          id: "contract-disputes-internal",
          label: "Contract Dispute",
          URL: "/contract-disputes",
          external: false,
          children: [
            {
              id: "contract-disputes",
              label: "Contract Disputes",
              URL: "/contract-disputes",
              external: false,
            },
            {
              id: "contract-disputes-qualify",
              label: "Check If You Qualify",
              URL: "/contract-disputes/qualify",
              external: false,
            },
            {
              id: "evictions",
              label: "Evictions (Landlords)",
              URL: "/evictions",
              external: false,
            },
          ],
        };
        if (!sortedNav.some((link) => link.label?.toLowerCase() === "contract dispute")) {
          const wIndex = sortedNav.findIndex(
            (link) => link.label?.toLowerCase() === "warranty"
          );
          if (wIndex !== -1) {
            sortedNav.splice(wIndex + 1, 0, contractDispute);
          } else {
            sortedNav.push(contractDispute);
          }
        }

        // Add dropdown children to "Property Damage" — First Party vs Third Party.
        const pdItem = sortedNav.find((link) =>
          (link.label?.toLowerCase() || "").includes("property damage")
        );
        if (pdItem && !pdItem.children) {
          pdItem.children = [
            {
              id: "pd-first-party",
              label: "First Party Claims",
              URL: "/property-damage-claims",
              external: false,
            },
            {
              id: "pd-third-party",
              label: "Third Party (Contractor)",
              URL: "/contractor-damage-claims",
              external: false,
            },
          ];
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
            <img src="/images/logo.png" alt="Louis Law Group" fetchPriority="high" decoding="async" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.navLinks}>
          <ul className={styles.navLinksWrapper}>
            {navLinks.map((link) => {
              const isActive = pathname === link.URL ||
                (link.children && link.children.some((c) => pathname === c.URL));
              const hasDropdown = !!(link.children && link.children.length);
              return (
                <li
                  key={link.id}
                  className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""} ${hasDropdown ? styles.hasDropdown : ""}`}
                >
                  {link.external ? (
                    <a href={link.URL} className={styles.navLink}>
                      {link.label}{hasDropdown && <span className={styles.caret}>▾</span>}
                    </a>
                  ) : (
                    <Link href={hasDropdown ? "#" : link.URL} className={styles.navLink}>
                      {link.label}{hasDropdown && <span className={styles.caret}>▾</span>}
                    </Link>
                  )}
                  {hasDropdown && (
                    <ul className={styles.dropdownMenu}>
                      {link.children.map((child) => (
                        <li key={child.id} className={styles.dropdownItem}>
                          {child.external ? (
                            <a href={child.URL}>{child.label}</a>
                          ) : (
                            <Link href={child.URL}>{child.label}</Link>
                          )}
                        </li>
                      ))}
                    </ul>
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
              {link.children ? (
                <>
                  <span className={styles.mobileNavParent}>{link.label}</span>
                  <ul className={styles.mobileSubMenu}>
                    {link.children.map((child) => (
                      <li key={child.id}>
                        {child.external ? (
                          <a href={child.URL} onClick={toggleMenu}>{child.label}</a>
                        ) : (
                          <Link href={child.URL} onClick={toggleMenu}>{child.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : link.external ? (
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
        <div className={styles.mobileMenuCta}>
          {/* Issue-selector dropdown → routes to the correct qualifier per case type */}
          <QualifyDropdown variant="dropdown" onNavigate={toggleMenu} />
          <a href="tel:+18336574812" className={styles.mobilePhoneBtn}>
            {isES ? "O llame (833) 657-4812" : "Or call (833) 657-4812"}
          </a>
        </div>
      </nav>
    </header>
  );
}
