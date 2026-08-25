import type { NextConfig } from "next";

// No remotePatterns needed — every product image is a local file under
// /public/products, served same-origin, so next/image works with zero
// extra config.
const nextConfig: NextConfig = {};

export default nextConfig;
