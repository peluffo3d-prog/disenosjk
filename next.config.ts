import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permitir mostrar las fotos que el dueño sube a Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
