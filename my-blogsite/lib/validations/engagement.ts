import { z } from "zod";

export const postEngagementSchema = z.object({
	postId: z.string().uuid(),
	slug: z.string().trim().min(1),
});

export const shareSchema = postEngagementSchema.extend({
	channel: z.enum(["copy", "native", "facebook", "x", "linkedin"]),
});

export const moderateCommentSchema = z.object({
	commentId: z.string().uuid(),
	postSlug: z.string().trim().min(1),
	approved: z.enum(["true", "false"]),
});
