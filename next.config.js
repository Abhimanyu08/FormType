/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: ["flagcdn.com"],
	},
};

module.exports = nextConfig;
