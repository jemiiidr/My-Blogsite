import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CommentCount } from "@/components/blog/comment-count";
import { MotionCard } from "@/components/motion/motion-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, HeartIcon } from "@/components/ui/icons";
import type { PublishedPostCard } from "@/lib/db/queries/posts";
import { formatCompactNumber, formatDate } from "@/lib/utils/format-date";

export function PostCard({
	post,
	featured = false,
}: {
	post: PublishedPostCard;
	featured?: boolean;
}) {
	return (
		<MotionCard className="h-full">
			<article
				className={`group h-full overflow-hidden rounded-[1.75rem] border bg-surface shadow-sm transition-shadow hover:shadow-xl ${
					featured ? "grid md:grid-cols-[1.2fr_1fr]" : "flex flex-col"
				}`}
			>
				<Link
					href={`/blog/${post.slug}`}
					className={`relative block overflow-hidden bg-surface-muted ${featured ? "min-h-72" : "aspect-[16/10]"}`}
				>
					<Image
						src={post.coverImageUrl}
						alt={post.title}
						fill
						unoptimized={post.coverImageUrl.startsWith("http")}
						sizes={
							featured
								? "(min-width: 768px) 58vw, 100vw"
								: "(min-width: 1024px) 33vw, 100vw"
						}
						className="object-cover transition duration-700 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-60" />
				</Link>
				<div
					className={`flex flex-1 flex-col ${featured ? "p-7 md:p-9" : "p-5"}`}
				>
					<div className="flex flex-wrap items-center gap-2">
						{post.category?.name ? <Badge>{post.category.name}</Badge> : null}
						<span className="text-xs text-muted">
							{formatDate(post.publishedAt ?? post.createdAt)}
						</span>
					</div>
					<Link href={`/blog/${post.slug}`} className="mt-4 block">
						<h2
							className={`${featured ? "text-3xl md:text-4xl" : "text-xl"} font-semibold leading-tight tracking-tight transition group-hover:text-accent`}
						>
							{post.title}
						</h2>
					</Link>
					<p
						className={`mt-3 text-muted ${featured ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6"}`}
					>
						{post.excerpt}
					</p>
					<div className="mt-auto flex items-center justify-between gap-4 pt-6">
						<Link
							href={`/authors/${post.author.slug}`}
							className="flex min-w-0 items-center gap-2.5"
						>
							<Avatar
								name={post.author.name}
								src={post.author.avatarUrl}
								size={34}
							/>
							<span className="truncate text-sm font-medium">
								{post.author.name}
							</span>
						</Link>
						<div className="flex items-center gap-3 text-xs text-muted">
							<span className="inline-flex items-center gap-1.5">
								<EyeIcon className="size-4" />
								{formatCompactNumber(post.engagement.views)}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<HeartIcon className="size-4" />
								{formatCompactNumber(post.engagement.likes)}
							</span>
							<Suspense
								fallback={
									<span className="h-4 w-8 animate-pulse rounded bg-surface-muted" />
								}
							>
								<CommentCount postId={post.id} />
							</Suspense>
						</div>
					</div>
				</div>
			</article>
		</MotionCard>
	);
}
