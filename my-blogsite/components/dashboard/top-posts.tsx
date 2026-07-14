import Link from "next/link";

export function TopPosts({ posts }: { posts: Array<{ id: string; title: string; slug: string; engagement: { views: number; likes: number } }> }) {
	return (
		<div className="rounded-3xl border bg-surface p-5 shadow-sm">
			<h2 className="font-semibold">Top stories</h2>
			<div className="mt-4 divide-y">
				{posts.length ? posts.map((post, index) => (
					<div key={post.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
						<span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent">{index + 1}</span>
						<div className="min-w-0 flex-1"><Link href={`/blog/${post.slug}`} className="line-clamp-1 font-medium hover:text-accent">{post.title}</Link><p className="text-xs text-muted">{post.engagement.views} views · {post.engagement.likes} likes</p></div>
					</div>
				)) : <p className="py-8 text-center text-sm text-muted">No stories yet.</p>}
			</div>
		</div>
	);
}
