"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./caselaw.module.css";

const CATEGORIES = [
  "All",
  "Property Insurance",
  "Bad Faith",
  "PA Regulations",
  "Carrier Disputes",
  "Appraisal",
  "Legislative",
];

export default function CaseLawGrid({ posts }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const visiblePosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Categories:</span>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterTag} ${isActive ? styles.filterTagActive : ""}`}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {visiblePosts.length === 0 ? (
        <div className={styles.noPosts}>
          <h2>No articles in this category on this page</h2>
          <p>Try another category or browse other pages for more articles.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {visiblePosts.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className={styles.postCard}>
              {post.cover && (
                <img
                  src={`https://login.louislawgroup.com${post.cover.url}`}
                  alt={post.title}
                  className={styles.postImage}
                />
              )}
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <span
                    className={styles.postTag}
                    style={{
                      background: post.tagColor.bg,
                      color: post.tagColor.text,
                      borderColor: post.tagColor.border,
                    }}
                  >
                    {post.category}
                  </span>
                  {post.dateLabel && (
                    <span className={styles.postDate}>{post.dateLabel}</span>
                  )}
                </div>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.description}</p>
                <span className={styles.readMore}>Read Analysis →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
