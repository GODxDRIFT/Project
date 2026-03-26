/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', '127.0.0.1', 'res.cloudinary.com', 'https://res.cloudinary.com', 'https://api.biziffy.com','https://lh3.googleusercontent.com','lh3.googleusercontent.com'],
    }
};

export default nextConfig;
