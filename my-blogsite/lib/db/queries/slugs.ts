import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { slugify } from "@/lib/utils/slugify";

const MAX_NUMERIC_SUFFIX = 500;

export async function createUniquePostSlug(
	title: string,
	excludePostId?: string,
) {
	const base = slugify(title) || "story";

	for (let suffix = 1; suffix <= MAX_NUMERIC_SUFFIX; suffix += 1) {
		const candidate = suffix === 1 ? base : `${base}-${suffix}`;
		const condition = excludePostId
			? and(eq(posts.slug, candidate), ne(posts.id, excludePostId))
			: eq(posts.slug, candidate);
		const [existing] = await db
			.select({ id: posts.id })
			.from(posts)
			.where(condition)
			.limit(1);

		if (!existing) return candidate;
	}

	throw new Error("Unable to generate a unique post slug.");
}

export async function createUniqueUserSlug(name: string) {
	const base = slugify(name) || "reader";

	for (let suffix = 1; suffix <= MAX_NUMERIC_SUFFIX; suffix += 1) {
		const candidate = suffix === 1 ? base : `${base}-${suffix}`;
		const [existing] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.slug, candidate))
			.limit(1);

		if (!existing) return candidate;
	}

	throw new Error("Unable to generate a unique account slug.");
}
