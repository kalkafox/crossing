/** @type {import('next').NextConfig} */
const optimizedImages = require("next-optimized-images");
const nextConfig = {
  reactStrictMode: true,
  optimizedImages,
};

module.exports = nextConfig;
