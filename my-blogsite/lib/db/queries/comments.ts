import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { comments, posts, users } from "@/lib/db/schema";

export async function getApprovedComments(postId: string) {
	return db
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
			},
		})
		.from(comments)
		.leftJoin(users, eq(comments.userId, users.id))
		.where(and(eq(comments.postId, postId), eq(comments.approved, true)))
		.orderBy(desc(comments.createdAt));
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
