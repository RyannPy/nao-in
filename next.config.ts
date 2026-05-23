import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tlsyuesupiqehllpegck.supabase.co",
      },
    ],
  },
};

export default nextConfig;
