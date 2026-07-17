import Link from "next/link";

export function Pagination({
	basePath,
	currentPage,
	totalPages,
	query = {},
	pageParam = "page",
	anchor,
}: {
	basePath: string;
	currentPage: number;
	totalPages: number;
	query?: Record<string, string | undefined>;
	pageParam?: string;
	anchor?: string;
}) {
	if (totalPages <= 1) return null;

	function buildHref(page: number) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query)) {
			if (value) params.set(key, value);
		}
		if (page > 1) params.set(pageParam, String(page));
		const search = params.toString();
		return `${basePath}${search ? `?${search}` : ""}${anchor ? `#${anchor}` : ""}`;
	}

	return (
		<nav
			aria-label="Pagination"
			className="mt-10 flex flex-wrap items-center justify-center gap-3"
		>
			{currentPage > 1 ? (
				<Link
					href={buildHref(currentPage - 1)}
					className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
				>
					Previous
				</Link>
			) : (
				<span className="rounded-full border border-border px-5 py-2.5 text-sm text-muted opacity-50">
					Previous
				</span>
			)}

			<span className="rounded-full bg-surface-muted px-4 py-2.5 text-sm font-medium text-muted">
				Page {currentPage} of {totalPages}
			</span>

			{currentPage < totalPages ? (
				<Link
					href={buildHref(currentPage + 1)}
					className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
				>
					Next
				</Link>
			) : (
				<span className="rounded-full border border-border px-5 py-2.5 text-sm text-muted opacity-50">
					Next
				</span>
			)}
		</nav>
	);
}
