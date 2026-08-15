/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
