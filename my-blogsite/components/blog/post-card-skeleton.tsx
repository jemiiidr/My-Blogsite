export function PostCardSkeleton({ featured = false }: { featured?: boolean }) {
	return (
		<div
			className={`overflow-hidden rounded-[1.75rem] border bg-surface ${featured ? "grid md:grid-cols-[1.2fr_1fr]" : ""}`}
		>
			<div
				className={`${featured ? "min-h-72" : "aspect-[16/10]"} animate-pulse bg-surface-muted`}
			/>
			<div className="space-y-4 p-6">
				<div className="h-5 w-28 animate-pulse rounded-full bg-surface-muted" />
				<div className="h-8 w-4/5 animate-pulse rounded bg-surface-muted" />
				<div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
				<div className="h-4 w-5/6 animate-pulse rounded bg-surface-muted" />
				<div className="flex justify-between pt-5">
					<div className="h-9 w-32 animate-pulse rounded-full bg-surface-muted" />
					<div className="h-5 w-24 animate-pulse rounded bg-surface-muted" />
				</div>
			</div>
		</div>
	);
}
