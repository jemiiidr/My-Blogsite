"use server";

import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAuthor } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { createUniquePostSlug } from "@/lib/db/queries/slugs";
import { posts } from "@/lib/db/schema";
import {
	checkRateLimit,
	getRequestIdentifier,
} from "@/lib/security/rate-limit";
import { sanitizeRichText } from "@/lib/utils/sanitize-html";
import { slugify } from "@/lib/utils/slugify";
import {
	coverImageFileSchema,
	postSchema,
	updatePostSchema,
} from "@/lib/validations/post";

export type PostActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[] | undefined>;
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

function getUploadedFile(formData: FormData) {
	const value = formData.get("coverImage");
	return value instanceof File && value.size > 0 ? value : null;
}

function getExtension(file: File) {
	const extension = file.name.split(".").pop()?.toLowerCase();
	if (extension && /^[a-z0-9]{2,5}$/.test(extension)) return extension;

	const mimeExtension = file.type.split("/")[1]?.replace("jpeg", "jpg");
	return mimeExtension && /^[a-z0-9]{2,5}$/.test(mimeExtension)
		? mimeExtension
		: "jpg";
}

async function uploadCoverImage(file: File, slug: string) {
	const isDevelopment = process.env.NODE_ENV === "development";
	const developmentToken = isDevelopment
		? process.env.BLOB_READ_WRITE_TOKEN
		: undefined;

	if (isDevelopment && !developmentToken) {
		throw new Error(
			"BLOB_READ_WRITE_TOKEN is required for local cover image uploads.",
		);
	}

	const blob = await put(`post-covers/${slug}.${getExtension(file)}`, file, {
		access: "public",
		addRandomSuffix: true,
		...(developmentToken
			? {
					token: developmentToken,
				}
			: {}),
	});

	return blob.url;
}

function isVercelBlobUrl(value: string) {
	try {
		const url = new URL(value);
		return (
			url.protocol === "https:" &&
			url.hostname.endsWith(".blob.vercel-storage.com")
		);
	} catch {
		return false;
	}
}

async function deleteCoverImageQuietly(url: string | null | undefined) {
	if (!url || !isVercelBlobUrl(url)) return;

	try {
		await del(url);
	} catch (error) {
		console.error("Cover image cleanup failed", error);
	}
}

function isUniqueConstraintError(error: unknown) {
	let current: unknown = error;

	for (let depth = 0; depth < 4; depth += 1) {
		if (!current || typeof current !== "object") return false;
		if ("code" in current && current.code === "23505") return true;
		current = "cause" in current ? current.cause : null;
	}

	return false;
}

function revalidatePostPages(...slugs: string[]) {
	revalidatePath("/");
	revalidatePath("/blog");
	revalidatePath("/authors/[slug]", "page");
	revalidatePath("/dashboard", "layout");

	for (const slug of new Set(slugs.filter(Boolean))) {
		revalidatePath(`/blog/${slug}`);
	}
}

export async function createPost(
	_previousState: PostActionState,
	formData: FormData,
): Promise<PostActionState> {
	const user = await requireAuthor();
	const parsed = postSchema.safeParse({
		title: formData.get("title"),
		excerpt: formData.get("excerpt"),
		body: formData.get("body"),
		categoryId: formData.get("categoryId"),
		tags: formData.get("tags"),
		intent: formData.get("intent"),
	});
	const coverImage = getUploadedFile(formData);
	const parsedCover = coverImageFileSchema.safeParse(coverImage);

	if (!parsed.success || !parsedCover.success) {
		return {
			success: false,
			fieldErrors: {
				...(parsed.success ? {} : z.flattenError(parsed.error).fieldErrors),
				...(parsedCover.success
					? {}
					: {
							coverImage: parsedCover.error.issues.map(
								(issue) => issue.message,
							),
						}),
			},
			message: "Please complete the required article fields.",
		};
	}

	const requestIdentifier = await getRequestIdentifier();
	const rateLimit = await checkRateLimit({
		action: "post:create",
		identifier: `${user.id}:${requestIdentifier}`,
		limit: 20,
		windowMs: 60 * 60 * 1000,
	});
	if (!rateLimit.allowed) {
		return {
			success: false,
			message: "Too many post submissions. Please try again later.",
		};
	}

	const slug = await createUniquePostSlug(parsed.data.title);
	let coverImageUrl: string;

	try {
		coverImageUrl = await uploadCoverImage(parsedCover.data, slug);
	} catch (error) {
		console.error("Cover image upload failed", error);
		return {
			success: false,
			fieldErrors: {
				coverImage: [
					"The cover image could not be uploaded. Check your Blob storage configuration and try again.",
				],
			},
			message: "Unable to upload the required cover image.",
		};
	}

	let createdSlug = slug;

	try {
		for (let attempt = 0; attempt < 5; attempt += 1) {
			try {
				const [created] = await db
					.insert(posts)
					.values({
						title: parsed.data.title,
						slug: createdSlug,
						excerpt: parsed.data.excerpt,
						body: sanitizeRichText(parsed.data.body),
						coverImageUrl,
						categoryId: parsed.data.categoryId,
						authorId: user.id,
						tags: parseTags(parsed.data.tags),
						status: parsed.data.intent,
						publishedAt: parsed.data.intent === "published" ? new Date() : null,
					})
					.returning({ slug: posts.slug });

				createdSlug = created.slug;
				break;
			} catch (error) {
				if (!isUniqueConstraintError(error) || attempt === 4) throw error;
				createdSlug = await createUniquePostSlug(parsed.data.title);
			}
		}
	} catch (error) {
		console.error("Post creation failed", error);
		await deleteCoverImageQuietly(coverImageUrl);
		return {
			success: false,
			message: "The story could not be saved. Please try again.",
		};
	}

	revalidatePostPages(createdSlug);

	redirect(
		parsed.data.intent === "published"
			? `/blog/${createdSlug}`
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
		excerpt: formData.get("excerpt"),
		body: formData.get("body"),
		categoryId: formData.get("categoryId"),
		tags: formData.get("tags"),
		intent: formData.get("intent"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct the article fields.",
		};
	}

	const [existingPost] = await db
		.select({
			id: posts.id,
			authorId: posts.authorId,
			slug: posts.slug,
			coverImageUrl: posts.coverImageUrl,
			publishedAt: posts.publishedAt,
		})
		.from(posts)
		.where(eq(posts.id, postId))
		.limit(1);
	if (!existingPost) return { success: false, message: "Post not found." };
	if (user.role !== "admin" && existingPost.authorId !== user.id) {
		return { success: false, message: "You cannot edit this post." };
	}

	const requestIdentifier = await getRequestIdentifier();
	const rateLimit = await checkRateLimit({
		action: "post:update",
		identifier: `${user.id}:${requestIdentifier}`,
		limit: 40,
		windowMs: 60 * 60 * 1000,
	});
	if (!rateLimit.allowed) {
		return {
			success: false,
			message: "Too many post updates. Please try again later.",
		};
	}

	const slug = await createUniquePostSlug(parsed.data.title, postId);
	const coverImage = getUploadedFile(formData);
	let coverImageUrl = existingPost.coverImageUrl;
	let replacementCoverImageUrl: string | null = null;

	if (coverImage) {
		const parsedCover = coverImageFileSchema.safeParse(coverImage);
		if (!parsedCover.success) {
			return {
				success: false,
				fieldErrors: {
					coverImage: parsedCover.error.issues.map((issue) => issue.message),
				},
				message: "Choose a valid replacement cover image.",
			};
		}

		try {
			replacementCoverImageUrl = await uploadCoverImage(parsedCover.data, slug);
			coverImageUrl = replacementCoverImageUrl;
		} catch (error) {
			console.error("Cover image upload failed", error);
			return {
				success: false,
				fieldErrors: {
					coverImage: [
						"The replacement image could not be uploaded. Check your Blob storage configuration and try again.",
					],
				},
				message: "Unable to upload the replacement cover image.",
			};
		}
	}

	let updatedSlug = slug;

	try {
		for (let attempt = 0; attempt < 5; attempt += 1) {
			try {
				await db
					.update(posts)
					.set({
						title: parsed.data.title,
						slug: updatedSlug,
						excerpt: parsed.data.excerpt,
						body: sanitizeRichText(parsed.data.body),
						coverImageUrl,
						categoryId: parsed.data.categoryId,
						tags: parseTags(parsed.data.tags),
						status: parsed.data.intent,
						publishedAt:
							parsed.data.intent === "published"
								? (existingPost.publishedAt ?? new Date())
								: null,
						updatedAt: new Date(),
					})
					.where(eq(posts.id, postId));
				break;
			} catch (error) {
				if (!isUniqueConstraintError(error) || attempt === 4) throw error;
				updatedSlug = await createUniquePostSlug(parsed.data.title, postId);
			}
		}
	} catch (error) {
		console.error("Post update failed", error);
		await deleteCoverImageQuietly(replacementCoverImageUrl);
		return {
			success: false,
			message: "The story could not be updated. Please try again.",
		};
	}

	if (
		replacementCoverImageUrl &&
		existingPost.coverImageUrl !== replacementCoverImageUrl
	) {
		await deleteCoverImageQuietly(existingPost.coverImageUrl);
	}

	revalidatePostPages(existingPost.slug, updatedSlug);

	redirect(
		parsed.data.intent === "published"
			? `/blog/${updatedSlug}`
			: "/dashboard/posts",
	);
}

export async function deletePost(formData: FormData) {
	const user = await requireAuthor();
	const parsed = z.object({ postId: z.string().uuid() }).safeParse({
		postId: formData.get("postId"),
	});
	if (!parsed.success) return;

	const [post] = await db
		.select({
			authorId: posts.authorId,
			slug: posts.slug,
			coverImageUrl: posts.coverImageUrl,
		})
		.from(posts)
		.where(eq(posts.id, parsed.data.postId))
		.limit(1);
	if (!post || (user.role !== "admin" && post.authorId !== user.id)) return;

	await db.delete(posts).where(eq(posts.id, parsed.data.postId));
	await deleteCoverImageQuietly(post.coverImageUrl);

	revalidatePostPages(post.slug);
}
