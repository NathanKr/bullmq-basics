import type { NextConfig } from "next";
import path from 'path'; // Import the 'path' module

const nextConfig: NextConfig = {
  /* config options here */
    // transpilePackages: ['common'], // <--- Use the name of the folder relative to the root
      transpilePackages: [path.resolve(__dirname, '../common')], // Resolves to /your-project-root/common
};

export default nextConfig;
