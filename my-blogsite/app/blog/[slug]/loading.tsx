export default function PostLoading() {
	const skeletonLines = Array.from(
		{ length: 8 },
		(_, index) => `skeleton-line-${index + 1}`,
	);

	return (
		<div className="mx-auto max-w-7xl animate-pulse px-4 py-14 sm:px-6 lg:px-8">
			<div className="mx-auto h-12 w-3/4 rounded-xl bg-surface-muted" />
			<div className="mx-auto mt-5 h-5 w-1/2 rounded bg-surface-muted" />
			<div className="mt-10 aspect-16/8 rounded-4xl bg-surface-muted" />
			<div className="mx-auto mt-12 max-w-3xl space-y-5">
				{skeletonLines.map((lineId, index) => (
					<div
						key={lineId}
						className={`h-4 rounded bg-surface-muted ${
							index % 3 === 0 ? "w-4/5" : "w-full"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
