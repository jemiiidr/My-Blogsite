import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AuthorCard } from "@/components/blog/author-card";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { LikeButton } from "@/components/blog/like-button";
import { PostCard } from "@/components/blog/post-card";
import { PostContent } from "@/components/blog/post-content";
import { ViewTracker } from "@/components/blog/view-tracker";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	ClockIcon,
	EyeIcon,
	HeartIcon,
	MessageIcon,
	ShareIcon,
} from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/auth/dal";
import {
	getCommentCount,
	getPostBySlug,
	getRelatedPosts,
	hasUserLikedPost,
} from "@/lib/db/queries/posts";
import { formatCompactNumber, formatDate } from "@/lib/utils/format-date";
import { getReadingTime } from "@/lib/utils/reading-time";

type PostPageProps = {
	params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	if (!post) notFound();

	const user = await getCurrentUser();
	const [commentCount, initialLiked, related] = await Promise.all([
		getCommentCount(post.id),
		hasUserLikedPost(post.id, user?.id),
		getRelatedPosts(post.id, post.category?.id ?? null),
	]);
	const readingTime = getReadingTime(post.body);

	return (
		<article>
			<ViewTracker postId={post.id} slug={post.slug} />
			<header className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 lg:px-8">
				<div className="flex flex-wrap justify-center gap-2">
					{post.category?.name ? <Badge>{post.category.name}</Badge> : null}
					{post.tags.slice(0, 3).map((tag) => (
						<Link key={tag} href={`/blog?tag=${tag}`}>
							<Badge className="hover:border-accent hover:text-accent">
								#{tag}
							</Badge>
						</Link>
					))}
				</div>
				<h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
					{post.title}
				</h1>
				<p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
					{post.excerpt}
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
					<Link
						href={`/authors/${post.author.slug}`}
						className="flex items-center gap-2 font-medium text-foreground hover:text-accent"
					>
						<Avatar
							name={post.author.name}
							src={post.author.avatarUrl}
							size={36}
						/>
						{post.author.name}
					</Link>
					<span>•</span>
					<span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
					<span>•</span>
					<span className="inline-flex items-center gap-1.5">
						<ClockIcon className="size-4" />
						{readingTime} min read
					</span>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative aspect-16/8 overflow-hidden rounded-4xl border bg-surface-muted shadow-2xl">
					<Image
						src={post.coverImageUrl}
						alt={post.title}
						fill
						priority
						unoptimized={post.coverImageUrl.startsWith("http")}
						sizes="(min-width: 1280px) 1200px, 100vw"
						className="object-cover"
					/>
				</div>
			</div>

			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
				<div className="min-w-0">
					<div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
						<div className="flex flex-wrap gap-5 text-sm text-muted">
							<span className="inline-flex items-center gap-1.5">
								<EyeIcon className="size-4" />
								{formatCompactNumber(post.engagement.views)} views
							</span>
							<span className="inline-flex items-center gap-1.5">
								<HeartIcon className="size-4" />
								{formatCompactNumber(post.engagement.likes)} likes
							</span>
							<span className="inline-flex items-center gap-1.5">
								<MessageIcon className="size-4" />
								{formatCompactNumber(commentCount)} comments
							</span>
							<span className="inline-flex items-center gap-1.5">
								<ShareIcon className="size-4" />
								{formatCompactNumber(post.engagement.shares)} shares
							</span>
						</div>
						<div className="flex items-start gap-2">
							<LikeButton
								postId={post.id}
								slug={post.slug}
								initialLiked={initialLiked}
							/>
							{/* <ShareButtons
								postId={post.id}
								slug={post.slug}
								title={post.title}
							/> */}
						</div>
					</div>
					<PostContent html={post.body} />
					<div className="mt-14 border-t pt-10">
						<AuthorCard author={post.author} />
					</div>
					<section className="mt-16" id="comments">
						<h2 className="text-3xl font-semibold tracking-tight">
							Join the conversation
						</h2>
						<p className="mt-2 text-sm text-muted">
							Guests may comment. Creating an account also lets you like
							stories.
						</p>
						<div className="mt-6">
							<CommentForm
								postId={post.id}
								slug={post.slug}
								defaultAuthorName={user?.name}
							/>
						</div>
						<div className="mt-8">
							<Suspense
								fallback={
									<div className="h-40 animate-pulse rounded-[1.75rem] bg-surface-muted" />
								}
							>
								<CommentList postId={post.id} />
							</Suspense>
						</div>
					</section>
				</div>
				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					<div className="rounded-3xl border bg-surface p-5">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
							Article details
						</p>
						<dl className="mt-5 space-y-4 text-sm">
							<div>
								<dt className="text-muted">Category</dt>
								<dd className="mt-1 font-medium">
									{post.category?.name ?? "Uncategorized"}
								</dd>
							</div>
							<div>
								<dt className="text-muted">Published</dt>
								<dd className="mt-1 font-medium">
									{formatDate(post.publishedAt)}
								</dd>
							</div>
							<div>
								<dt className="text-muted">Reading time</dt>
								<dd className="mt-1 font-medium">{readingTime} minutes</dd>
							</div>
						</dl>
					</div>
				</aside>
			</div>

			{related.length ? (
				<section className="border-t bg-surface-muted/40 py-16">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-semibold tracking-tight">
							Continue reading
						</h2>
						<div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{related.map((item) => (
								<PostCard key={item.id} post={item} />
							))}
						</div>
					</div>
				</section>
			) : null}
		</article>
	);
}
