"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [navLinks, setNavLinks] = useState([]);

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

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Navigation Columns */}
          {navLinks.map((section) => (
            <div key={section.id} className={styles.column}>
              <h3>{section.label}</h3>
              <ul className={styles.navList}>
                {section.pages?.map((subPage) => (
                  <li key={subPage.id} className={styles.navItem}>
                    <Link
                      href={`${section.URL}/${subPage.Slug}`}
                      className={styles.navLink}
                    >
                      {subPage.Title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright section */}
        <div className={styles.copyright}>
          <p>Copyright © {new Date().getFullYear()} Louis Law Group</p>
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