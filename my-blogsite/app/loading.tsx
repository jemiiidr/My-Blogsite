export default function AppLoading() {
	const skeletonKey = Array.from(
		{ length: 6 },
		(_, index) => `skeleton-line-${index + 1}`,
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="h-10 w-64 animate-pulse rounded-xl bg-surface-muted" />
			<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{skeletonKey.map((skeletonId) => (
					<div
						key={skeletonId}
						className="h-72 animate-pulse rounded-3xl bg-surface-muted"
					/>
				))}
			</div>
		</div>
	);
}
