"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./search.module.css";

const SearchResults = () => {
  return (
    <div className={styles.container}>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchContent />
      </Suspense>
    </div>
  );
};

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return <h2>Search Results for: "{query}"</h2>;
};

export default SearchResults;
