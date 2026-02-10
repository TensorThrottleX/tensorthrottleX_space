/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
