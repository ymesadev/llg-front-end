'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar({ links }) {
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const toggleSection = (sectionId) => {
    // If clicking the same section, close it. Otherwise, open the new section
    setExpandedSectionId(expandedSectionId === sectionId ? null : sectionId);
  };

  const handleClick = (e, sectionId, href) => {
    // Only toggle if there are pages and not Legal or Resources sections
    if (e.target.closest(`.${styles.arrow}`)) {
      e.preventDefault();
      toggleSection(sectionId);
    }
  };

  const constructUrl = (section) => {
    // If it's a child page
    if (section.parent_page?.URL) {
      return `${section.parent_page.URL}/${section.Slug}`.replace(/^\/+/, '/');
    }
    
    // If it's a main section
    if (section.URL) {
      return section.URL.replace(/^\/+/, '/');
    }
    
    // Fallback to slug if available
    if (section.Slug) {
      return `/${section.Slug}`.replace(/^\/+/, '/');
    }
    
    return null;
  };

  const isStaticSection = (section) => {
    return section?.label === 'Legal' || section?.label === 'Resources';
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {links.map((section) => (
          section && section.display_footer && (
            <div key={section.id} className={styles.sidebarSection}>
              {constructUrl(section) ? (
                <Link 
                  href={constructUrl(section)}
                  className={styles.sectionHeader}
                  onClick={(e) => handleClick(e, section.id, constructUrl(section))}
                >
                  <h2>{section?.label || ''}</h2>
                  {section.pages && section.pages.length > 0 && !isStaticSection(section) && (
                    <span className={`${styles.arrow} ${expandedSectionId === section.id ? styles.expanded : ''}`}>
                      ▼
                    </span>
                  )}
                </Link>
              ) : (
                <div className={styles.sectionHeader}>
                  <h2>{section?.label || ''}</h2>
                  {section.pages && section.pages.length > 0 && !isStaticSection(section) && (
                    <span className={`${styles.arrow} ${expandedSectionId === section.id ? styles.expanded : ''}`}>
                      ▼
                    </span>
                  )}
                </div>
              )}
              {section.pages && section.pages.length > 0 && (
                <ul className={`${styles.sidebarList} ${isStaticSection(section) || expandedSectionId === section.id ? styles.expanded : ''}`}>
                  {section.pages.map((page) => (
                    page && (
                      <li key={page.id} className={styles.sidebarItem}>
                        <Link 
                          href={constructUrl(page)}
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