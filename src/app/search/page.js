// "use client";

// import { useSearchParams } from "next/navigation";
// import { Suspense, useState, useEffect } from "react";
// import styles from "./search.module.css";

// const SearchResults = () => {
//   return (
//     <div className={styles.container}>
//       <Suspense fallback={<h2>Loading...</h2>}>
//         <SearchContent />
//       </Suspense>
//     </div>
//   );
// };

// const SearchContent = () => {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");

//   // Handle case where query is not found
//   if (!query) {
//     return <h2>No search query provided.</h2>;
//   }

//   return <SearchQueryDisplay query={query} />;
// };

// const SearchQueryDisplay = ({ query }) => {
//   // Simulate search results fetching logic
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResults = async () => {
//       const res = await fetch(`/api/search?query=${query}`);
//       const data = await res.json();
//       setResults(data.results || []);
//       setLoading(false);
//     };

//     fetchResults();
//   }, [query]);

//   if (loading) {
//     return <h2>Loading results for "{query}"...</h2>;
//   }

//   return (
//     <>
//       <h2>Search Results for: "{query}"</h2>
//       {results.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         results.map((result) => (
//           <div key={result.id}>
//             <h3>{result.title}</h3>
//             <p>{result.excerpt}</p>
//           </div>
//         ))
//       )}
//     </>
//   );
// };

// export default SearchResults;
