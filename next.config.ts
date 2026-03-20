import type { NextConfig } from 'next'

const nextConfig = {
  cacheComponents: true,
  // ignore ts errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as NextConfig

export default nextConfig
