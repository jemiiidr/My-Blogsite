import { z } from "zod";

export const createAuthorSchema = z.object({
	name: z.string().trim().min(2).max(80),
	email: z.string().trim().email(),
	password: z.string().min(8).max(128),
	bio: z.string().trim().max(500).optional().default(""),
	avatarUrl: z.string().trim().optional().default(""),
});

export const authorStatusSchema = z.object({
	userId: z.string().uuid(),
	isActive: z.enum(["true", "false"]),
});
