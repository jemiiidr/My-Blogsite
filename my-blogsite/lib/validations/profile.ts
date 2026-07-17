import { z } from "zod";

export const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must contain at least 2 characters.")
		.max(80, "Name must contain at most 80 characters."),

	bio: z.string().trim().max(500, "Bio must contain at most 500 characters."),
});
