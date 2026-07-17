import { z } from "zod";

export const promoteUserToAuthorSchema = z.object({
	userId: z.string().uuid("Select a valid user."),
});

export const authorStatusSchema = z.object({
	userId: z.string().uuid(),
	isActive: z.enum(["true", "false"]),
});
