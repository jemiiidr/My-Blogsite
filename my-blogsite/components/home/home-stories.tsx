import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getPublishedPosts } from "@/lib/db/queries/posts";

export async function HomeStories() {
	const posts = await getPublishedPosts({ limit: 7 });
	if (!posts.length) return null;

	const [featured, ...latest] = posts;
	return (
		<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div className="mb-8 flex items-end justify-between gap-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
						Curated for you
					</p>
					<h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
						Stories worth your time
					</h2>
				</div>
				<Link
					href="/blog"
					className="hidden items-center gap-2 text-sm font-semibold hover:text-accent sm:flex"
				>
					View all <ArrowRightIcon className="size-4" />
				</Link>
			</div>
			<PostCard post={featured} featured />
			<div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{latest.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</section>
	);
}
