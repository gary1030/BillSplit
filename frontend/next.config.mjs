/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
const nextConfig = {
  output: "standalone",
};

export default process.env.ANALYZE === "true"
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
