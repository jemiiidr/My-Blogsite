import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { getPublishedPosts } from "@/lib/db/queries/posts";
import { users } from "@/lib/db/schema";

export async function getAuthors() {
	return db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
			slug: users.slug,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
			isActive: users.isActive,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(inArray(users.role, ["admin", "author"]))
		.orderBy(asc(users.name));
}

export async function getPublicAuthors() {
	return db
		.select({
			id: users.id,
			name: users.name,
			slug: users.slug,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
			role: users.role,
		})
		.from(users)
		.where(
			and(inArray(users.role, ["admin", "author"]), eq(users.isActive, true)),
		)
		.orderBy(asc(users.name));
}

export async function getAuthorBySlug(slug: string) {
	const [author] = await db
		.select({
			id: users.id,
			name: users.name,
			slug: users.slug,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
			role: users.role,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(
			and(
				eq(users.slug, slug),
				inArray(users.role, ["admin", "author"]),
				eq(users.isActive, true),
			),
		)
		.limit(1);

	if (!author) return null;
	const allPosts = await getPublishedPosts();
	return {
		...author,
		posts: allPosts.filter((post) => post.author.id === author.id),
	};
}

export async function getUsersAvailableForAuthorRole() {
	return db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			avatarUrl: users.avatarUrl,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(and(eq(users.role, "user"), eq(users.isActive, true)))
		.orderBy(asc(users.name));
}
