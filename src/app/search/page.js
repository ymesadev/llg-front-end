"use client";
import { useSearchParams } from "next/navigation";
import styles from "./search.module.css";
const SearchResults = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);
  console.log("render");
  return (
    <div className={styles.container}>
      <h2>Search Results for: "{query}"</h2>
      {/* Fetch & display search results based on query */}
    </div>
  );
};

export default SearchResults;
