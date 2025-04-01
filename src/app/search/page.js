"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function MyComponent() {
  const [resultsMap, setResultsMap] = useState(
    () =>
      new Map([
        ["pages", []],
        ["team", []],
        ["articles", []],
      ])
  );

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Three separate endpoints
        const urlPages = `${strapiURL}/api/pages?filters[$or][0][Title][$containsi]=${query}&filters[$or][1][Sections][body][$containsi]=${query}&populate=*`;
        const urlTeam = `${strapiURL}/api/team-pages?filters[$or][0][title][$containsi]=${query}&filters[$or][1][Description][$containsi]=${query}&populate=*`;
        const urlArticles = `${strapiURL}/api/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`;

        // Fetch in parallel
        const [pagesRes, teamRes, articlesRes] = await Promise.all([
          fetch(urlPages),
          fetch(urlTeam),
          fetch(urlArticles),
        ]);

        if (!pagesRes.ok || !teamRes.ok || !articlesRes.ok) {
          throw new Error("One or more requests failed");
        }

        // Parse JSON
        const [pagesData, teamData, articlesData] = await Promise.all([
          pagesRes.json(),
          teamRes.json(),
          articlesRes.json(),
        ]);

        // Update Map immutably
        setResultsMap((prevMap) => {
          // create a copy so we have a new reference (otherwise React might not re-render)
          const newMap = new Map(prevMap);
          newMap.set("pages", pagesData.data || []);
          newMap.set("team", teamData.data || []);
          newMap.set("articles", articlesData.data || []);
          return newMap;
        });
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [strapiURL, query]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Results for: {query}</h2>

      {/*
        Convert the Map into an array of [key, value] pairs so we can .map over them.
        key => "pages" | "team" | "articles"
        value => array of items
      */}
      {[...resultsMap.entries()].map(([collectionName, items]) => (
        <div key={collectionName}>
          <h3>{collectionName}</h3>

          {items.length === 0 ? (
            <p>No {collectionName} found.</p>
          ) : (
            items.map((item) => (
              <div key={item.id}>
                {/* If item has a 'title' or 'Title', adapt as needed */}
                <h4>{item.Title || item.title || "Untitled"}</h4>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
