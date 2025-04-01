import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import styles from "./SearchBar.module.css";

const popularSearches = [
  "Car Accident",
  "Insurance Claims",
  "Personal Injury",
  "Property Damage",
];

const SearchBar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };

  const handleSearch = (searchQuery) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchVisible(false); // Close search bar after search
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
        <div className={styles.inputWrapper}>
          <input
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
          <h3>Popular Searches</h3>
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
  );
};

export default SearchBar;
