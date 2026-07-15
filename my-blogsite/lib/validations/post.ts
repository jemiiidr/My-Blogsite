import { z } from "zod";

const MAX_BODY_TEXT_LENGTH = 50_000;
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 30;

function extractReadableText(html: string) {
	return html
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;|&apos;/gi, "'")
		.replace(/\s+/g, " ")
		.trim();
}

function isValidCoverImage(value: string) {
	if (/^\/images\/[^\s]+$/i.test(value)) {
		return true;
	}

	try {
		const url = new URL(value);

		return (
			url.protocol === "https:" &&
			Boolean(url.hostname) &&
			!url.username &&
			!url.password
		);
	} catch {
		return false;
	}
}

function parseTags(value: string) {
	return value
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean);
}

const titleSchema = z
	.string()
	.trim()
	.min(5, "Title must be at least 5 characters.")
	.max(140, "Title must not exceed 140 characters.");

const slugSchema = z
	.string()
	.trim()
	.max(100, "Slug must not exceed 100 characters.")
	.refine(
		(value) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
		"Slug can only contain lowercase letters, numbers, and hyphens.",
	);

const excerptSchema = z
	.string()
	.trim()
	.min(20, "Excerpt must be at least 20 characters.")
	.max(320, "Excerpt must not exceed 320 characters.");

const richTextBodySchema = z
	.string()
	.trim()
	.min(1, "Article body is required.")
	.refine(
		(value) => extractReadableText(value).length >= 40,
		"Article body must contain at least 40 readable characters.",
	)
	.refine(
		(value) => extractReadableText(value).length <= MAX_BODY_TEXT_LENGTH,
		`Article body must not exceed ${MAX_BODY_TEXT_LENGTH.toLocaleString()} readable characters.`,
	);

const imagePathSchema = z
	.string()
	.trim()
	.min(1, "A cover image is required.")
	.refine(
		isValidCoverImage,
		"Use a local /images path or a complete HTTPS image URL.",
	);

const categorySchema = z.string().trim().uuid("Select a valid category.");

const tagsSchema = z
	.string()
	.trim()
	.max(250, "The combined tags must not exceed 250 characters.")
	.refine(
		(value) => parseTags(value).length <= MAX_TAGS,
		`Add no more than ${MAX_TAGS} tags.`,
	)
	.refine(
		(value) => parseTags(value).every((tag) => tag.length <= MAX_TAG_LENGTH),
		`Each tag must not exceed ${MAX_TAG_LENGTH} characters.`,
	);

const postFields = {
	title: titleSchema,
	slug: slugSchema,
	excerpt: excerptSchema,
	body: richTextBodySchema,
	coverImageUrl: imagePathSchema,
	categoryId: categorySchema,
	tags: tagsSchema,
	intent: z.enum(["draft", "published"]),
	publishPassword: z.string().default(""),
};

function validatePublishingIntent(
	data: {
		intent: "draft" | "published";
		publishPassword: string;
	},
	context: z.RefinementCtx,
) {
	if (data.intent === "published" && data.publishPassword.trim().length === 0) {
		context.addIssue({
			code: "custom",
			path: ["publishPassword"],
			message: "Publishing key is required to publish a story.",
		});
	}
}

export const postSchema = z
	.object(postFields)
	.superRefine(validatePublishingIntent);

export const updatePostSchema = z
	.object({
		...postFields,
		postId: z.string().uuid("The selected post is invalid."),
	})
	.superRefine(validatePublishingIntent);

export type PostInput = z.infer<typeof postSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
