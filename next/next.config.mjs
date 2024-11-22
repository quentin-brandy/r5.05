/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    publicRuntimeConfig: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      },
};
export default nextConfig;
