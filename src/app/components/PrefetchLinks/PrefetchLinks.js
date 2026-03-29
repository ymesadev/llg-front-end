"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrefetchLinks() {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const href = entry.target.getAttribute("href");
            if (href) {
              router.prefetch(href);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: "200px" }
    );

    // Find all internal links in article content
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => observer.observe(link));

    return () => observer.disconnect();
  }, [router]);

  return null;
}
