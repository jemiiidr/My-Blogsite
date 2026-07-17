import { z } from "zod";

const MAX_BODY_TEXT_LENGTH = 50_000;
const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 30;
export const MAX_COVER_IMAGE_BYTES = 4 * 1024 * 1024;

const allowedCoverImageTypes = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/avif",
]);

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
	excerpt: excerptSchema,
	body: richTextBodySchema,
	categoryId: categorySchema,
	tags: tagsSchema,
	intent: z.enum(["draft", "published"]),
};

export const postSchema = z.object(postFields);

export const updatePostSchema = z.object({
	...postFields,
	postId: z.string().uuid("The selected post is invalid."),
});

export const coverImageFileSchema = z
	.instanceof(File, { message: "Choose a cover image." })
	.refine((file) => file.size > 0, "Choose a cover image.")
	.refine(
		(file) => file.size <= MAX_COVER_IMAGE_BYTES,
		"Cover image must not exceed 4 MB.",
	)
	.refine(
		(file) => allowedCoverImageTypes.has(file.type),
		"Use a JPG, PNG, WebP, GIF, or AVIF image.",
	);

export type PostInput = z.infer<typeof postSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
