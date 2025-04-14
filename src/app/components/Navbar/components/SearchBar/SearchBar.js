import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import styles from "./SearchBar.module.css";

const popularSearches = [
  "Car Accident",
  "Insurance Claims",
  "Personal Injury",
  "Property Damage",
  "SSDI",
  "Social Security",
];

const SearchBar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef(null);

  const toggleSearch = () => {
    setSearchVisible((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      return !prev;
    });
  };

  const handleSearch = (searchQuery) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchVisible(false);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      {searchVisible && (
        <div className={styles.overlay} onClick={toggleSearch}></div>
      )}
      <button
        onClick={toggleSearch}
        className={`${styles.searchButton} ${searchVisible ? styles.show : ""}`}
      >
        {searchVisible ? <IoCloseOutline /> : <HiMiniMagnifyingGlass />}
      </button>

      <div
        className={`${styles.searchContainer} ${
          searchVisible ? styles.show : ""
        }`}
      >
        <div className={styles.searchWrapper}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef} // Attach ref to input
              type="text"
              placeholder="Search anything"
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && (
              <IoCloseOutline
                className={styles.clearIcon}
                onClick={() => setQuery("")}
              />
            )}
            <HiMiniMagnifyingGlass
              className={styles.searchIcon}
              onClick={() => handleSearch()}
            />
          </div>

          {/* Popular Searches */}
          <div className={styles.popularSearches}>
            <h3>Looking For...</h3>
            <ul>
              {popularSearches.map((term, index) => (
                <li key={index} onClick={() => handleSearch(term)}>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
