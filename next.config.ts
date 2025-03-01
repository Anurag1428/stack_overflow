import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {},  // ✅ Enables server actions
    mdxRs: true,        // ✅ Enables Rust-based MDX compiler
  },
  serverExternalPackages: ['mongoose'], // ✅ Use this instead of experimental.serverComponentsExternalPackages
};

export default nextConfig;
