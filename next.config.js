/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/return-it',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
