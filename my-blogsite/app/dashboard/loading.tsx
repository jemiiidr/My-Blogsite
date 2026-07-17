const statSkeletons = [
	{ id: "total-views" },
	{ id: "published-stories" },
	{ id: "likes" },
	{ id: "comments" },
];

const chartBars = [
	{ id: "bar-1", height: "h-16" },
	{ id: "bar-2", height: "h-24" },
	{ id: "bar-3", height: "h-20" },
	{ id: "bar-4", height: "h-32" },
	{ id: "bar-5", height: "h-28" },
	{ id: "bar-6", height: "h-40" },
	{ id: "bar-7", height: "h-36" },
	{ id: "bar-8", height: "h-48" },
	{ id: "bar-9", height: "h-44" },
	{ id: "bar-10", height: "h-52" },
	{ id: "bar-11", height: "h-40" },
	{ id: "bar-12", height: "h-56" },
];

const topPostSkeletons = [
	{ id: "top-post-1" },
	{ id: "top-post-2" },
	{ id: "top-post-3" },
	{ id: "top-post-4" },
	{ id: "top-post-5" },
];

const contentSkeletons = [
	{ id: "content-1", titleWidth: "w-3/4" },
	{ id: "content-2", titleWidth: "w-2/3" },
	{ id: "content-3", titleWidth: "w-4/5" },
	{ id: "content-4", titleWidth: "w-1/2" },
	{ id: "content-5", titleWidth: "w-3/5" },
	{ id: "content-6", titleWidth: "w-3/4" },
];

const commentSkeletons = [
	{ id: "comment-1" },
	{ id: "comment-2" },
	{ id: "comment-3" },
	{ id: "comment-4" },
];

function Skeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div
			className={`animate-pulse rounded-full bg-surface-muted ${className}`}
		/>
	);
}

export default function DashboardLoading() {
	return (
		<div
			className="space-y-6"
			aria-busy="true"
			aria-label="Loading dashboard"
		>
			<span className="sr-only">Loading dashboard analytics...</span>

			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div className="space-y-3">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-72 max-w-full sm:w-96" />
					<Skeleton className="h-5 w-64 max-w-full" />
				</div>

				<Skeleton className="h-11 w-40" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{statSkeletons.map((stat) => (
					<div
						key={stat.id}
						className="rounded-3xl border border-border bg-surface p-5 shadow-sm"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-4">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-9 w-20" />
							</div>

							<Skeleton className="size-10" />
						</div>

						<Skeleton className="mt-5 h-3 w-32" />
					</div>
				))}
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
				<div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-2">
							<Skeleton className="h-5 w-36" />
							<Skeleton className="h-4 w-52" />
						</div>

						<Skeleton className="h-9 w-28" />
					</div>

					<div className="mt-8 flex h-72 items-end gap-2 border-b border-border px-1">
						{chartBars.map((bar) => (
							<div
								key={bar.id}
								className={`flex-1 animate-pulse rounded-t-lg bg-surface-muted ${bar.height}`}
							/>
						))}
					</div>

					<div className="mt-3 flex justify-between">
						<Skeleton className="h-3 w-10" />
						<Skeleton className="h-3 w-10" />
						<Skeleton className="h-3 w-10" />
						<Skeleton className="h-3 w-10" />
					</div>
				</div>

				<div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
					<div className="space-y-2">
						<Skeleton className="h-5 w-28" />
						<Skeleton className="h-4 w-44" />
					</div>

					<div className="mt-5 divide-y divide-border">
						{topPostSkeletons.map((post) => (
							<div
								key={post.id}
								className="flex items-center gap-3 py-4 first:pt-0"
							>
								<Skeleton className="size-10 shrink-0" />

								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-4/5" />
									<Skeleton className="h-3 w-2/5" />
								</div>

								<Skeleton className="h-4 w-10" />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
				<div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-center justify-between gap-4">
						<div className="space-y-2">
							<Skeleton className="h-5 w-28" />
							<Skeleton className="h-4 w-40" />
						</div>

						<Skeleton className="h-4 w-14" />
					</div>

					<div className="mt-4 divide-y divide-border">
						{contentSkeletons.map((post) => (
							<div
								key={post.id}
								className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center"
							>
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className={`h-4 ${post.titleWidth}`} />
									<Skeleton className="h-3 w-56 max-w-full" />
								</div>

								<Skeleton className="h-4 w-8" />
							</div>
						))}
					</div>
				</div>

				<div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
					<div className="space-y-2">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-48" />
					</div>

					<div className="mt-5 divide-y divide-border">
						{commentSkeletons.map((comment) => (
							<div
								key={comment.id}
								className="space-y-3 py-4 first:pt-0"
							>
								<div className="flex items-center gap-3">
									<Skeleton className="size-9 shrink-0" />

									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-28" />
										<Skeleton className="h-3 w-20" />
									</div>
								</div>

								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-4/5" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}