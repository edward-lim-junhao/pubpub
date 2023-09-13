/** @type {import('next').NextConfig} */
const withPreconstruct = require("@preconstruct/next");

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverActions: true,
	},
};

module.exports = withPreconstruct(nextConfig);
