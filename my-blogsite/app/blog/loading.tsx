import { PostCardSkeleton } from "@/components/blog/post-card-skeleton";

export default function BlogLoading() {
	const skeletonCards = Array.from(
		{ length: 6 },
		(_, index) => `post-card-skeleton-${index + 1}`,
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="h-16 w-2/3 animate-pulse rounded-2xl bg-surface-muted" />
			<div className="mt-8 h-20 animate-pulse rounded-3xl bg-surface-muted" />
			<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{skeletonCards.map((skeletonId) => (
					<PostCardSkeleton key={skeletonId} />
				))}
			</div>
		</div>
	);
}
