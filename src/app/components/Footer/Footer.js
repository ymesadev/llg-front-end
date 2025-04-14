"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [isClient, setIsClient] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/navigations?populate[pages][populate]=*&populate=pages`
        );
        if (!response.ok) throw new Error("Failed to fetch navigation");
        const data = await response.json();

        // Sort navigation items by Order
        const sortedNav = data.data.sort((a, b) => {
          return (a.Order || 0) - (b.Order || 0);
        });

        // Initialize expanded state for all sections
        const initialExpandedState = {};
        sortedNav.forEach(section => {
          initialExpandedState[section.id] = false;
        });
        setExpandedSections(initialExpandedState);
        
        setNavLinks(sortedNav);
      } catch (error) {
        console.error("Error fetching navigation:", error);
      }
    };

    fetchNavLinks();
  }, []);

  const constructUrl = (page) => {
    if (!page) return '/';

    // Get the parent URL and page slug, removing any leading/trailing slashes
    const parentUrl = (page.parent_page?.URL || '').replace(/^\/+|\/+$/g, '');
    const pageSlug = (page.Slug || '').replace(/^\/+|\/+$/g, '');

    if (parentUrl && pageSlug) {
      return `/${parentUrl}/${pageSlug}`;
    }

    return pageSlug ? `/${pageSlug}` : '/';
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Legal Column */}
          <div className={styles.column}>
            <div className={styles.sectionHeader}>
              <Link href="#" className={styles.sectionLink}>
                <h1>Legal</h1>
              </Link>
            </div>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/ada-compliance" className={styles.navLink}>
                  Ada Compliance
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/terms-of-use-agreement" className={styles.navLink}>
                  Terms of Use Agreement
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/privacy-policy" className={styles.navLink}>
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Areas Column - Dynamic Content */}
          <div className={styles.column}>
            <div className={styles.sectionHeader}>
              <Link href="#" className={styles.sectionLink}>
                <h1>Practice Areas</h1>
              </Link>
            </div>
            <ul className={styles.navList}>
              {navLinks.map((section) => (
                <li key={section.id} className={styles.navItem}>
                  <Link href={section.URL || '#'} className={styles.navLink}>
                    {section.label}
                  </Link>
                  {section.pages && section.pages.length > 0 && (
                    <ul className={`${styles.navList} ${expandedSections[section.id] ? styles.expanded : ''}`}>
                      {section.pages.map((page) => (
                        <li key={page.id} className={styles.navItem}>
                          <Link
                            href={constructUrl(page)}
                            className={styles.navLink}
                          >
                            {page.submenu_title || page.Title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className={styles.column}>
            <div className={styles.sectionHeader}>
              <Link href="#" className={styles.sectionLink}>
                <h1>Resources</h1>
              </Link>
            </div>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/resources" className={styles.navLink}>
                  Blog
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/job-id-00001" className={styles.navLink}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>Copyright © {isClient ? currentYear : ''} Louis Law Group</p>
          <p>
            All rights reserved. This website and its content are protected by copyright law.
            No part of this website may be reproduced, distributed, or transmitted in any form
            or by any means, including photocopying, recording, or other electronic or mechanical
            methods, without the prior written permission of Louis Law Group, except in the case
            of brief quotations embodied in critical reviews and certain other noncommercial uses
            permitted by copyright law. For permission requests, please contact Louis Law Group directly.
          </p>
        </div>
      </div>
    </footer>
  );
} 