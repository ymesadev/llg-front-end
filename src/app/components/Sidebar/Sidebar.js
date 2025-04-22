'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar({ links }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {links.map((section) => (
          section && section.display_footer && (
            <div key={section.id} className={styles.sidebarSection}>
              <button 
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <h2>{section?.label || ''}</h2>
                <span className={`${styles.arrow} ${expandedSections[section.id] ? styles.expanded : ''}`}>
                  ▼
                </span>
              </button>
              {section.pages && section.pages.length > 0 && (
                <ul className={`${styles.sidebarList} ${expandedSections[section.id] ? styles.expanded : ''}`}>
                  {section.pages.map((page) => (
                    page && (
                      <li key={page.id}>
                        <Link 
                          href={page.parent_page?.URL ? `${page.parent_page.URL}/${page.Slug}` : `/${page.Slug}`}
                          className={styles.sidebarLink}
                        >
                          {page?.submenu_title || page?.Title || ''}
                        </Link>
                      </li>
                    )
                  ))}
                </ul>
              )}
            </div>
          )
        ))}
      </div>
    </aside>
  );
} 