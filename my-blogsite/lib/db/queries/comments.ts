import "server-only";

import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { comments, posts, users } from "@/lib/db/schema";

export async function getApprovedCommentsPage(
	postId: string,
	page: number,
	pageSize = 5,
) {
	const [totalRow] = await db
		.select({ value: count() })
		.from(comments)
		.where(and(eq(comments.postId, postId), eq(comments.approved, true)));

	const total = totalRow?.value ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(page, 1), totalPages);

	const rows = await db
		.select({
			id: comments.id,
			authorName: comments.authorName,
			body: comments.body,
			createdAt: comments.createdAt,
			approved: comments.approved,
			user: {
				id: users.id,
				name: users.name,
				avatarUrl: users.avatarUrl,
				slug: users.slug,
				role: users.role,
			},
		})
		.from(comments)
		.leftJoin(users, eq(comments.userId, users.id))
		.where(and(eq(comments.postId, postId), eq(comments.approved, true)))
		.orderBy(desc(comments.createdAt))
		.limit(pageSize)
		.offset((currentPage - 1) * pageSize);

	return { comments: rows, total, totalPages, currentPage };
}

export async function getRecentComments(limit = 5) {
	return db
		.select({
			id: comments.id,
			postId: comments.postId,
			authorName: comments.authorName,
			body: comments.body,
			createdAt: comments.createdAt,
			approved: comments.approved,
		})
		.from(comments)
		.orderBy(desc(comments.createdAt))
		.limit(limit);
}

export async function getAllCommentsForModeration() {
	return db
		.select({
			id: comments.id,
			authorName: comments.authorName,
			body: comments.body,
			createdAt: comments.createdAt,
			approved: comments.approved,
			postTitle: posts.title,
			postSlug: posts.slug,
		})
		.from(comments)
		.innerJoin(posts, eq(comments.postId, posts.id))
		.orderBy(desc(comments.createdAt));
}
