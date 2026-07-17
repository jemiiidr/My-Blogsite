import { PostCard } from "@/components/blog/post-card";
import { Pagination } from "@/components/ui/pagination";
import { getPaginatedPublishedPosts } from "@/lib/db/queries/posts";

export async function PostGrid({
	search,
	category,
	tag,
	page,
	pageSize = 6,
	groupByCategory = false,
}: {
	search?: string;
	category?: string;
	tag?: string;
	page: number;
	pageSize?: number;
	groupByCategory?: boolean;
}) {
	const result = await getPaginatedPublishedPosts({
		search,
		category,
		tag,
		page,
		pageSize,
	});

	if (!result.posts.length) {
		return (
			<div className="rounded-4xl border border-dashed bg-surface px-6 py-20 text-center">
				<h2 className="text-xl font-semibold">No stories found</h2>
				<p className="mt-2 text-sm text-muted">
					Try a different search, category, or tag.
				</p>
			</div>
		);
	}

	const groups = new Map<
		string,
		{ name: string; posts: typeof result.posts }
	>();

	for (const post of result.posts) {
		const key = post.category?.slug ?? "uncategorized";
		const group = groups.get(key);
		if (group) {
			group.posts.push(post);
		} else {
			groups.set(key, {
				name: post.category?.name ?? "Uncategorized",
				posts: [post],
			});
		}
	}

	return (
		<div>
			{groupByCategory ? (
				<div className="space-y-12">
					{Array.from(groups.entries()).map(([groupKey, group]) => (
						<section key={groupKey}>
							<div className="mb-6 flex items-center gap-4">
								<h2 className="shrink-0 text-xl font-semibold tracking-tight sm:text-2xl">
									{group.name}
								</h2>
								<div className="h-px flex-1 bg-border" />
							</div>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{group.posts.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
							</div>
						</section>
					))}
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{result.posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			)}

			<Pagination
				basePath="/blog"
				currentPage={result.currentPage}
				totalPages={result.totalPages}
				query={{ search, category, tag }}
			/>
		</div>
	);
}
