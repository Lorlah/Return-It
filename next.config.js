/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output: 'export'` and no `basePath`.
  //
  // Static export produces a site with no server, which silently drops every
  // API route — including the inbound-email webhook and the retention cron,
  // which are the reason this app is deployed at all. `basePath` was a GitHub
  // Pages artifact; Vercel serves from the root.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
