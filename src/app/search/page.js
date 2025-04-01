"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./search.module.css";
import { limitText } from "../utils/LimitText";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import ContactSection from "../components/Contact/ContactSection";

const collections = [
  {
    name: "pages",
    filters: [
      { field: "Title", condition: "containsi" },
      { field: "[Sections][body]", condition: "containsi" },
    ],
  },
  {
    name: "team-pages",
    filters: [
      { field: "title", condition: "containsi" },
      { field: "Description", condition: "containsi" },
    ],
  },
  {
    name: "articles",
    filters: [
      { field: "title", condition: "containsi" },
      { field: "description", condition: "containsi" },
    ],
  },
];

// Build a large-limit URL for each collection
function buildUrl({ name, filters }, query) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const baseUrl = `${strapiURL}/api/${name}`;

  const filterParams = filters
    .map(
      (filter, index) =>
        `filters[$or][${index}][${filter.field}][$${
          filter.condition
        }]=${encodeURIComponent(query)}`
    )
    .join("&");

  return `${baseUrl}?${filterParams}&populate=*&pagination[limit]=9999`;
}

// Simple skeleton loader component
function SkeletonSearch() {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonLine} style={{ width: "70%" }} />
          <div className={styles.skeletonLine} style={{ width: "100%" }} />
          <div className={styles.skeletonLine} style={{ width: "85%" }} />
        </div>
      ))}
    </div>
  );
}

// A utility function to generate an array of pages for your pagination
function getPagesArray(currentPage, totalPages) {
  const maxVisible = 7;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let startPage = Math.max(1, currentPage - 3);
  let endPage = Math.min(totalPages, currentPage + 3);

  if (startPage === 1) {
    endPage = maxVisible;
  } else if (endPage === totalPages) {
    startPage = totalPages - (maxVisible - 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
}

export default function SearchResults() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");

  const [allItems, setAllItems] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Loading / Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from each collection in parallel
        const responses = await Promise.all(
          collections.map(async (c) => {
            const url = buildUrl(c, query);
            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`Failed to fetch ${c.name}`);
            }
            const data = await res.json();
            return (data.data || []).map((item) => ({
              ...item,
              __collectionName: c.name,
            }));
          })
        );

        const combined = responses.flat();
        setAllItems(combined);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  if (!query) {
    return <p>No search query provided.</p>;
  }

  // ---------- SKELETON LOADING ----------
  if (loading) {
    return (
      <>
        <div className={styles.container}>
          <h2>Search results for: "{query}"</h2>
          <SkeletonSearch />
        </div>
        <Results />
        <Steps />
        <ContactSection />
      </>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return <p>Error: {error}</p>;
  }

  // ---------- DISPLAY RESULTS ----------
  const totalResults = allItems.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const currentPage = Math.min(page, totalPages) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displaySlice = allItems.slice(startIndex, endIndex);
  const displayedEnd = Math.min(endIndex, totalResults);

  const pagesArray = getPagesArray(currentPage, totalPages);

  return (
    <>
      <div className={styles.container}>
        <h2>Search results for: "{query}"</h2>

        {totalResults === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <p>
              Displaying {startIndex + 1}–{displayedEnd} of {totalResults}{" "}
              results
            </p>

            {displaySlice.map((item) => {
              const title = item?.Title || item?.title || "No Title";
              return (
                <div key={item.id} className={styles.resultItem}>
                  <small>{item.__collectionName}</small>
                  <h3 className={styles.resultTitle}>{title}</h3>

                  {/* PAGES */}
                  {item.__collectionName === "pages" && (
                    <div>
                      <p className={styles.resultDescription}>
                        {limitText(
                          item?.Hero?.intro
                            ?.map((introItem) =>
                              introItem?.children
                                ?.map((childItem) => childItem?.text)
                                .join(" ")
                            )
                            .join(" "),
                          400
                        ) || "No content available"}{" "}
                        <Link href={`/${item.Slug || item.slug}`}>
                          <span>Read More</span>
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* TEAM-PAGES */}
                  {item.__collectionName === "team-pages" && (
                    <div>
                      <p className={styles.resultDescription}>
                        {limitText(
                          item?.Description?.map((description) =>
                            description?.children
                              ?.map((childItem) => childItem?.text)
                              .join(" ")
                          ).join(" "),
                          400
                        ) || "No description available"}{" "}
                        <Link href={`/${item.Slug || item.slug}`}>
                          <span>Read More</span>
                        </Link>
                      </p>
                    </div>
                  )}

                  {/* ARTICLES */}
                  {item.__collectionName === "articles" && (
                    <div>
                      <p className={styles.resultDescription}>
                        {limitText(item?.description, 400) ||
                          "No description available"}{" "}
                        <Link href={`/${item.Slug || item.slug}`}>
                          <span>Read More</span>
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              {currentPage > 1 && (
                <button onClick={() => setPage(currentPage - 1)}>Prev</button>
              )}
              {pagesArray.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={
                    pageNum === currentPage ? styles.activePage : undefined
                  }
                >
                  {pageNum}
                </button>
              ))}
              {currentPage < totalPages && (
                <button onClick={() => setPage(currentPage + 1)}>Next</button>
              )}
            </div>
          </>
        )}
      </div>
      <Results />
      <Steps />
      <ContactSection />
    </>
  );
}
