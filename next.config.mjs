/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper handling of dynamic routes
  experimental: {
    // Enable proper catch-all route handling
  },
  // Ensure all routes are handled correctly
  async rewrites() {
    return [];
  },
};

export default nextConfig;
