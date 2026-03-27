"use client";
import { useEffect } from "react";

export default function ArticlePageMarker() {
  useEffect(() => {
    document.body.setAttribute("data-article-page", "true");
    return () => document.body.removeAttribute("data-article-page");
  }, []);
  return null;
}
