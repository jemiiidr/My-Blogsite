import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ThemeScript } from "@/components/providers/theme-script";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "LUCID — Modern Storytelling",
		template: "%s | LUCID",
	},
	description:
		"A modern storytelling platform built with Next.js, Neon, Drizzle ORM, and Server Actions.",
};

function NavbarFallback() {
	return <div className="h-16 border-b bg-background" />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
		>
			<head><ThemeScript /></head>
			<body>
				<LenisProvider>
					<Suspense fallback={<NavbarFallback />}><Navbar /></Suspense>
					<main className="min-h-[70vh]">{children}</main>
					<Footer />
				</LenisProvider>
			</body>
		</html>
	);
}
