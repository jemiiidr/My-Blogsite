import { z } from "zod";

export const commentSchema = z.object({
	postId: z.string().uuid("Invalid post."),
	slug: z.string().trim().min(1, "Post slug is required."),
	authorName: z
		.string()
		.trim()
		.min(1, "Your name is required.")
		.max(80, "Name must be 80 characters or fewer."),
	body: z
		.string()
		.trim()
		.min(10, "Comment must be at least 10 characters.")
		.max(2000, "Comment must be 2,000 characters or fewer."),
});
