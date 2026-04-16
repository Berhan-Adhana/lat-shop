/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // product images
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // google auth avatars
      },
    ],
  },
};

module.exports = nextConfig;
