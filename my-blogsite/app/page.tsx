import { Suspense } from "react";

import { PostCardSkeleton } from "@/components/blog/post-card-skeleton";
import { CategoryStrip } from "@/components/home/category-strip";
import { HeroSection } from "@/components/home/hero-section";
import { HomeStories } from "@/components/home/home-stories";

function StoriesFallback() {
	return (
		<div className="mx-auto max-w-7xl space-y-7 px-4 py-20 sm:px-6 lg:px-8">
			<PostCardSkeleton featured />
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, index) => <PostCardSkeleton key={index} />)}
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<Suspense fallback={<StoriesFallback />}><HomeStories /></Suspense>
			<Suspense fallback={<div className="h-64 animate-pulse border-y bg-surface-muted" />}><CategoryStrip /></Suspense>
		</>
	);
}
