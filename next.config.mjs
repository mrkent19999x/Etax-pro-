/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Tắt ESLint khi build để tăng tốc
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  // Tối ưu cho dev mode - giảm file watchers
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check changes mỗi 1 giây thay vì watch real-time
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
      }
    }
    return config
  },
}

export default nextConfig
