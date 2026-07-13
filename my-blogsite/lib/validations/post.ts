import { z } from "zod";

const imagePathSchema = z.string().trim().min(1, "A cover image is required.").refine(
	(value) => value.startsWith("/") || /^https?:\/\//i.test(value),
	"Use a local /images path or a complete https:// URL.",
);

export const postSchema = z.object({
	title: z.string().trim().min(5, "Title must be at least 5 characters.").max(140),
	slug: z.string().trim().max(100).optional().or(z.literal("")),
	excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters.").max(320),
	body: z.string().trim().min(40, "Article body is too short."),
	coverImageUrl: imagePathSchema,
	categoryId: z.string().uuid("Select a category."),
	tags: z.string().trim().max(250),
	intent: z.enum(["draft", "published"]),
	publishPassword: z.string().optional().default(""),
});

export const updatePostSchema = postSchema.extend({
	postId: z.string().uuid(),
});
