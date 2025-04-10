"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [navLinks, setNavLinks] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  // Fetch navigation links from Strapi with populated pages and their details
  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/navigations?populate[pages][populate]=*&populate=parent`
        );
        if (!response.ok) throw new Error("Failed to fetch navigation links");

        const data = await response.json();
        console.log('Navigation Data:', data); // For debugging
        const sortedNav = data.data.sort((a, b) => a.Order - b.Order);
        setNavLinks(sortedNav);
      } catch (error) {
        console.error("❌ Error fetching navigation:", error);
      }
    };

    fetchNavLinks();
  }, []);

  // Helper function to construct proper URL based on page data
  const constructUrl = (page) => {
    if (!page) return '/';

    // If page has a full_slug, use it
    if (page.full_slug) {
      return `/${page.full_slug.replace(/^\/+|\/+$/g, '')}`;
    }

    // If page has a parent, construct URL with parent's URL
    if (page.parent?.URL) {
      const parentUrl = page.parent.URL.replace(/^\/+|\/+$/g, '');
      const pageSlug = page.Slug.replace(/^\/+|\/+$/g, '');
      return `/${parentUrl}/${pageSlug}`;
    }

    // Otherwise, just use the page's slug
    return `/${page.Slug.replace(/^\/+|\/+$/g, '')}`;
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Navigation Columns */}
          {navLinks.map((section) => (
            <div key={section.id} className={styles.column}>
              <h3>{section.label}</h3>
              <ul className={styles.navList}>
                {section.pages?.map((page) => (
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
            </div>
          ))}
        </div>

        {/* Copyright section */}
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