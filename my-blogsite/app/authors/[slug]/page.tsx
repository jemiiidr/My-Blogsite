import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/post-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuthorBySlug } from "@/lib/db/queries/authors";
import { formatDate } from "@/lib/utils/format-date";

export default async function AuthorProfilePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const author = await getAuthorBySlug(slug);
	if (!author) notFound();

	const totalViews = author.posts.reduce(
		(sum, post) => sum + post.engagement.views,
		0,
	);
	return (
		<div>
			<section className="border-b bg-[radial-gradient(circle_at_50%_0%,rgba(168,137,255,0.22),transparent_45%)]">
				<div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
					<Avatar
						name={author.name}
						src={author.avatarUrl}
						size={112}
						className="mx-auto shadow-xl"
					/>
					<div className="mt-6">
						<Badge>{author.role}</Badge>
					</div>
					<h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
						{author.name}
					</h1>
					<p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
						{author.bio || "A contributing author at LUCID."}
					</p>
					<div className="mt-8 flex justify-center gap-8 text-sm">
						<div>
							<p className="text-2xl font-semibold">{author.posts.length}</p>
							<p className="text-muted">Stories</p>
						</div>
						<div>
							<p className="text-2xl font-semibold">{totalViews}</p>
							<p className="text-muted">Views</p>
						</div>
						<div>
							<p className="text-2xl font-semibold">
								{formatDate(author.createdAt)}
							</p>
							<p className="text-muted">Joined</p>
						</div>
					</div>
				</div>
			</section>
			<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-semibold tracking-tight">
					Published stories
				</h2>
				{author.posts.length ? (
					<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{author.posts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				) : (
					<p className="mt-8 rounded-2xl border border-dashed p-8 text-center text-muted">
						No published stories yet.
					</p>
				)}
			</section>
		</div>
	);
}
