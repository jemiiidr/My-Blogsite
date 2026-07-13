import "server-only";

import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
	categories,
	comments,
	likes,
	posts,
	postViews,
	shares,
	users,
} from "@/lib/db/schema";

export type PublishedPostCard = Awaited<
	ReturnType<typeof getPublishedPosts>
>[number];

export async function getPostEngagement(postId: string) {
	const [[likeCount], [viewCount], [shareCount]] = await Promise.all([
		db.select({ value: count() }).from(likes).where(eq(likes.postId, postId)),
		db
			.select({ value: count() })
			.from(postViews)
			.where(eq(postViews.postId, postId)),
		db.select({ value: count() }).from(shares).where(eq(shares.postId, postId)),
	]);

	return {
		likes: likeCount?.value ?? 0,
		views: viewCount?.value ?? 0,
		shares: shareCount?.value ?? 0,
	};
}

export async function getCommentCount(postId: string) {
	const [row] = await db
		.select({ value: count() })
		.from(comments)
		.where(and(eq(comments.postId, postId), eq(comments.approved, true)));
	return row?.value ?? 0;
}

export async function getPublishedPosts(options?: {
	search?: string;
	category?: string;
	tag?: string;
	limit?: number;
}) {
	const rows = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			excerpt: posts.excerpt,
			coverImageUrl: posts.coverImageUrl,
			createdAt: posts.createdAt,
			publishedAt: posts.publishedAt,
			tags: posts.tags,
			author: {
				id: users.id,
				name: users.name,
				slug: users.slug,
				avatarUrl: users.avatarUrl,
			},
			category: {
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
			},
		})
		.from(posts)
		.innerJoin(users, eq(posts.authorId, users.id))
		.leftJoin(categories, eq(posts.categoryId, categories.id))
		.where(eq(posts.status, "published"))
		.orderBy(desc(posts.publishedAt), desc(posts.createdAt));

	const search = options?.search?.toLowerCase().trim();
	const category = options?.category?.toLowerCase().trim();
	const tag = options?.tag?.toLowerCase().trim();

	let filtered = rows.filter((row) => {
		const matchesSearch = search
			? `${row.title} ${row.excerpt} ${row.author.name}`
					.toLowerCase()
					.includes(search)
			: true;
		const matchesCategory = category
			? row.category?.slug.toLowerCase() === category
			: true;
		const matchesTag = tag
			? row.tags.some((value) => value.toLowerCase() === tag)
			: true;
		return matchesSearch && matchesCategory && matchesTag;
	});

	if (options?.limit) filtered = filtered.slice(0, options.limit);

	return Promise.all(
		filtered.map(async (row) => ({
			...row,
			engagement: await getPostEngagement(row.id),
		})),
	);
}

export async function getPostBySlug(slug: string) {
	const [row] = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			body: posts.body,
			excerpt: posts.excerpt,
			coverImageUrl: posts.coverImageUrl,
			createdAt: posts.createdAt,
			publishedAt: posts.publishedAt,
			updatedAt: posts.updatedAt,
			tags: posts.tags,
			status: posts.status,
			author: {
				id: users.id,
				name: users.name,
				slug: users.slug,
				avatarUrl: users.avatarUrl,
				bio: users.bio,
			},
			category: {
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
			},
		})
		.from(posts)
		.innerJoin(users, eq(posts.authorId, users.id))
		.leftJoin(categories, eq(posts.categoryId, categories.id))
		.where(and(eq(posts.slug, slug), eq(posts.status, "published")))
		.limit(1);

	if (!row) return null;
	return { ...row, engagement: await getPostEngagement(row.id) };
}

export async function getPostByIdForEditor(id: string) {
	const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
	return row ?? null;
}

export async function getRelatedPosts(
	postId: string,
	categoryId: string | null,
) {
	const all = await getPublishedPosts({ limit: 8 });
	return all
		.filter(
			(item) =>
				item.id !== postId && (!categoryId || item.category?.id === categoryId),
		)
		.slice(0, 3);
}

export async function getDashboardPosts(user: { id: string; role: string }) {
	const condition =
		user.role === "admin" ? undefined : eq(posts.authorId, user.id);

	const rows = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			status: posts.status,
			createdAt: posts.createdAt,
			publishedAt: posts.publishedAt,
			updatedAt: posts.updatedAt,
			authorId: posts.authorId,
			authorName: users.name,
			coverImageUrl: posts.coverImageUrl,
		})
		.from(posts)
		.innerJoin(users, eq(posts.authorId, users.id))
		.where(condition)
		.orderBy(desc(posts.updatedAt));

	return Promise.all(
		rows.map(async (row) => ({
			...row,
			engagement: await getPostEngagement(row.id),
			comments: await getCommentCount(row.id),
		})),
	);
}

export async function hasUserLikedPost(postId: string, userId?: string | null) {
	if (!userId) return false;
	const [row] = await db
		.select({ id: likes.id })
		.from(likes)
		.where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
		.limit(1);
	return Boolean(row);
}

export async function getAllPostSlugs() {
	return db
		.select({ slug: posts.slug })
		.from(posts)
		.where(eq(posts.status, "published"));
}
