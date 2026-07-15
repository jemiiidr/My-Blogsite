import { PostCard } from "@/components/blog/post-card";
import { getPublishedPosts } from "@/lib/db/queries/posts";

export async function PostGrid({
	search,
	category,
	tag,
	limit,
}: {
	search?: string;
	category?: string;
	tag?: string;
	limit?: number;
}) {
	const posts = await getPublishedPosts({ search, category, tag, limit });

	if (!posts.length) {
		return (
			<div className="rounded-4xl border border-dashed bg-surface px-6 py-20 text-center">
				<h2 className="text-xl font-semibold">No stories found</h2>
				<p className="mt-2 text-sm text-muted">
					Try a different search, category, or tag.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
