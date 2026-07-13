import "server-only";

import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { comments, postViews, posts, users } from "@/lib/db/schema";
import { getAuthors } from "@/lib/db/queries/authors";
import { getDashboardPosts } from "@/lib/db/queries/posts";

export async function getDashboardAnalytics(user: { id: string; role: string }) {
	const dashboardPosts = await getDashboardPosts(user);
	const postIds = dashboardPosts.map((post) => post.id);

	const views = postIds.length
		? await db
				.select({ postId: postViews.postId, viewedAt: postViews.viewedAt })
				.from(postViews)
				.where(inArray(postViews.postId, postIds))
				.orderBy(desc(postViews.viewedAt))
		: [];

	const recentComments = postIds.length
		? await db
				.select({
					id: comments.id,
					postId: comments.postId,
					authorName: comments.authorName,
					body: comments.body,
					createdAt: comments.createdAt,
					approved: comments.approved,
				})
				.from(comments)
				.where(inArray(comments.postId, postIds))
				.orderBy(desc(comments.createdAt))
				.limit(8)
		: [];

	const viewMap = new Map<string, number>();
	for (const view of views) {
		const date = view.viewedAt.toISOString().slice(0, 10);
		viewMap.set(date, (viewMap.get(date) ?? 0) + 1);
	}

	const viewsByDate = Array.from(viewMap.entries())
		.map(([date, value]) => ({ date, value }))
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(-14);

	const totals = dashboardPosts.reduce(
		(acc, post) => {
			acc.views += post.engagement.views;
			acc.likes += post.engagement.likes;
			acc.shares += post.engagement.shares;
			acc.comments += post.comments;
			return acc;
		},
		{ views: 0, likes: 0, shares: 0, comments: 0 },
	);

	const authors = user.role === "admin" ? await getAuthors() : [];

	return {
		posts: dashboardPosts,
		recentComments,
		viewsByDate,
		totals: {
			...totals,
			posts: dashboardPosts.length,
			published: dashboardPosts.filter((post) => post.status === "published")
				.length,
			drafts: dashboardPosts.filter((post) => post.status === "draft").length,
			authors: authors.length,
		},
		topPosts: [...dashboardPosts]
			.sort((a, b) => b.engagement.views - a.engagement.views)
			.slice(0, 5),
	};
}

export async function getUserByEmail(email: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email.toLowerCase()))
		.limit(1);
	return user ?? null;
}

export async function getPostOwner(postId: string) {
	const [post] = await db
		.select({ id: posts.id, authorId: posts.authorId, slug: posts.slug })
		.from(posts)
		.where(eq(posts.id, postId))
		.limit(1);
	return post ?? null;
}
