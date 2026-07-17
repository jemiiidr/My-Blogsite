import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sa2yxjetghvalcvk.public.blob.vercel-storage.com",
				pathname: "/post-covers/**",
			},
		],
	},
};

export default nextConfig;
