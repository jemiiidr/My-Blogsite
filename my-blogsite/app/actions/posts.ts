"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAuthor } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { sanitizeRichText } from "@/lib/utils/sanitize-html";
import { slugify } from "@/lib/utils/slugify";
import { postSchema, updatePostSchema } from "@/lib/validations/post";

export type PostActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[]>;
};

function parseTags(value: string) {
	return Array.from(
		new Set(
			value
				.split(",")
				.map((tag) => slugify(tag))
				.filter(Boolean),
		),
	).slice(0, 8);
}

function canPublish(publishPassword: string) {
	const expected = process.env.EDITOR_PASSWORD;
	return Boolean(expected && publishPassword === expected);
}

export async function createPost(
	_previousState: PostActionState,
	formData: FormData,
): Promise<PostActionState> {
	const user = await requireAuthor();
	const parsed = postSchema.safeParse({
		title: formData.get("title"),
		slug: formData.get("slug"),
		excerpt: formData.get("excerpt"),
		body: formData.get("body"),
		coverImageUrl: formData.get("coverImageUrl"),
		categoryId: formData.get("categoryId"),
		tags: formData.get("tags"),
		intent: formData.get("intent"),
		publishPassword: formData.get("publishPassword"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please complete the required article fields.",
		};
	}

	if (
		parsed.data.intent === "published" &&
		!canPublish(parsed.data.publishPassword)
	) {
		return {
			success: false,
			fieldErrors: { publishPassword: ["The publishing key is incorrect."] },
			message: "Enter the correct publishing key.",
		};
	}

	const slug = slugify(parsed.data.slug || parsed.data.title);
	if (!slug)
		return { success: false, message: "Could not create a valid slug." };

	const [existing] = await db
		.select({ id: posts.id })
		.from(posts)
		.where(eq(posts.slug, slug))
		.limit(1);
	if (existing) {
		return {
			success: false,
			fieldErrors: { slug: ["This slug is already in use."] },
		};
	}

	const [created] = await db
		.insert(posts)
		.values({
			title: parsed.data.title,
			slug,
			excerpt: parsed.data.excerpt,
			body: sanitizeRichText(parsed.data.body),
			coverImageUrl: parsed.data.coverImageUrl,
			categoryId: parsed.data.categoryId,
			authorId: user.id,
			tags: parseTags(parsed.data.tags),
			status: parsed.data.intent,
			publishedAt: parsed.data.intent === "published" ? new Date() : null,
		})
		.returning({ slug: posts.slug });

	revalidatePath("/blog");
	revalidatePath("/");
	revalidatePath("/dashboard");
	redirect(
		parsed.data.intent === "published"
			? `/blog/${created.slug}`
			: "/dashboard/posts",
	);
}

export async function updatePost(
	postId: string,
	_previousState: PostActionState,
	formData: FormData,
): Promise<PostActionState> {
	const user = await requireAuthor();
	const parsed = updatePostSchema.safeParse({
		postId,
		title: formData.get("title"),
		slug: formData.get("slug"),
		excerpt: formData.get("excerpt"),
		body: formData.get("body"),
		coverImageUrl: formData.get("coverImageUrl"),
		categoryId: formData.get("categoryId"),
		tags: formData.get("tags"),
		intent: formData.get("intent"),
		publishPassword: formData.get("publishPassword"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct the article fields.",
		};
	}

	const [existingPost] = await db
		.select({ id: posts.id, authorId: posts.authorId, slug: posts.slug })
		.from(posts)
		.where(eq(posts.id, postId))
		.limit(1);
	if (!existingPost) return { success: false, message: "Post not found." };
	if (user.role !== "admin" && existingPost.authorId !== user.id) {
		return { success: false, message: "You cannot edit this post." };
	}

	if (
		parsed.data.intent === "published" &&
		!canPublish(parsed.data.publishPassword)
	) {
		return {
			success: false,
			fieldErrors: { publishPassword: ["The publishing key is incorrect."] },
		};
	}

	const slug = slugify(parsed.data.slug || parsed.data.title);
	const [slugOwner] = await db
		.select({ id: posts.id })
		.from(posts)
		.where(and(eq(posts.slug, slug), ne(posts.id, postId)))
		.limit(1);
	if (slugOwner) {
		return {
			success: false,
			fieldErrors: { slug: ["This slug is already in use."] },
		};
	}

	await db
		.update(posts)
		.set({
			title: parsed.data.title,
			slug,
			excerpt: parsed.data.excerpt,
			body: sanitizeRichText(parsed.data.body),
			coverImageUrl: parsed.data.coverImageUrl,
			categoryId: parsed.data.categoryId,
			tags: parseTags(parsed.data.tags),
			status: parsed.data.intent,
			publishedAt: parsed.data.intent === "published" ? new Date() : null,
			updatedAt: new Date(),
		})
		.where(eq(posts.id, postId));

	revalidatePath("/blog");
	revalidatePath(`/blog/${existingPost.slug}`);
	revalidatePath(`/blog/${slug}`);
	revalidatePath("/dashboard");
	redirect(
		parsed.data.intent === "published" ? `/blog/${slug}` : "/dashboard/posts",
	);
}

export async function deletePost(formData: FormData) {
	const user = await requireAuthor();
	const parsed = z.object({ postId: z.string().uuid() }).safeParse({
		postId: formData.get("postId"),
	});
	if (!parsed.success) return;

	const [post] = await db
		.select({ authorId: posts.authorId, slug: posts.slug })
		.from(posts)
		.where(eq(posts.id, parsed.data.postId))
		.limit(1);
	if (!post || (user.role !== "admin" && post.authorId !== user.id)) return;

	await db.delete(posts).where(eq(posts.id, parsed.data.postId));
	revalidatePath("/blog");
	revalidatePath(`/blog/${post.slug}`);
	revalidatePath("/dashboard");
}
