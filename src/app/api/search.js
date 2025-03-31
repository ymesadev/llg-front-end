// // /pages/api/search.js
// export async function GET(req) {
//   try {
//     const query = req.nextUrl.searchParams.get("query") || ""; // Extract query parameter

//     const endpoints = [
//       `${process.env.STRAPI_URL}/api/pages?filters[$or][0][Title][$containsi]=${query}&filters[$or][1][Sections][body][$containsi]=${query}&populate=*`,
//       `${process.env.STRAPI_URL}/api/team-pages?filters[$or][0][title][$containsi]=${query}&filters[$or][1][Description][$containsi]=${query}&populate=*`,
//       `${process.env.STRAPI_URL}/api/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=*`,
//     ];

//     // Fetch data concurrently
//     const responses = await Promise.allSettled(
//       endpoints.map((url) => fetch(url, { cache: "no-store" }))
//     );

//     // Handle the responses and parse JSON
//     const data = await Promise.all(
//       responses
//         .filter((res) => res.status === "fulfilled")
//         .map(async (res) => {
//           try {
//             const json = await res.value.json();
//             return json;
//           } catch (err) {
//             console.error("Error parsing JSON:", err);
//             return null;
//           }
//         })
//     );

//     const results = data.flatMap((res) => res?.data || []);
//     return new Response(JSON.stringify({ results }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching search results:", error);
//     return new Response(
//       JSON.stringify({ results: [], error: "Failed to fetch data" }),
//       { status: 500 }
//     );
//   }
// }
