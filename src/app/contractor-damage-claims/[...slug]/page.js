// Route handler for /contractor-damage-claims/[...article-slug]
// Delegates to the top-level [...slug] page with the full path prefix,
// because Next.js App Router won't pass these URLs to the root catch-all
// once contractor-damage-claims/ exists as a named directory.
import MainPage, { generateMetadata as mainMeta } from "../../[...slug]/page";

export async function generateMetadata(props) {
  const params = await props.params;
  return mainMeta({ params: { slug: ["contractor-damage-claims", ...params.slug] } });
}

export default async function Page(props) {
  const params = await props.params;
  return MainPage({ params: { slug: ["contractor-damage-claims", ...params.slug] } });
}
