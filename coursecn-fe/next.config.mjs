/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tăng tốc độ build
  swcMinify: true,
  // Tối ưu hình ảnh
  images: {
    unoptimized: true, // chỉ dùng trong dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;
