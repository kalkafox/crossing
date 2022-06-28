/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["pbs.twimg.com", "abs.twimg.com", "media.twitter.com"],
  },
};

module.exports = nextConfig;
