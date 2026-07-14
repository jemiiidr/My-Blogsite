export default function AppLoading() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="h-10 w-64 animate-pulse rounded-xl bg-surface-muted" />
			<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="h-72 animate-pulse rounded-3xl bg-surface-muted"
					/>
				))}
			</div>
		</div>
	);
}
