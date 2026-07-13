import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().trim().min(2).max(80),
	bio: z.string().trim().max(500),
	avatarUrl: z.string().trim().max(500).optional().default(""),
});
