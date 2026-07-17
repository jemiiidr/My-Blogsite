"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
	authorStatusSchema,
	promoteUserToAuthorSchema,
} from "@/lib/validations/author";

export type AuthorActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: {
		userId?: string[];
	};
};

export async function promoteUserToAuthor(
	_previousState: AuthorActionState,
	formData: FormData,
): Promise<AuthorActionState> {
	await requireAdmin();

	const parsed = promoteUserToAuthorSchema.safeParse({
		userId: formData.get("userId"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: z.flattenError(parsed.error).fieldErrors,
			message: "Select a user to promote.",
		};
	}

	const [promotedUser] = await db
		.update(users)
		.set({
			role: "author",
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(users.id, parsed.data.userId),
				eq(users.role, "user"),
				eq(users.isActive, true),
			),
		)
		.returning({
			id: users.id,
			name: users.name,
		});

	if (!promotedUser) {
		return {
			success: false,
			fieldErrors: {
				userId: ["This user is unavailable or is already an author."],
			},
			message: "The user could not be promoted.",
		};
	}

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
	revalidatePath("/dashboard", "layout");

	return {
		success: true,
		message: `${promotedUser.name} is now an author.`,
	};
}

export async function toggleAuthorStatus(formData: FormData): Promise<void> {
	await requireAdmin();

	const parsed = authorStatusSchema.safeParse({
		userId: formData.get("userId"),
		isActive: formData.get("isActive"),
	});

	if (!parsed.success) {
		return;
	}

	const [targetUser] = await db
		.select({
			id: users.id,
			role: users.role,
			slug: users.slug,
			isActive: users.isActive,
		})
		.from(users)
		.where(eq(users.id, parsed.data.userId))
		.limit(1);

	if (targetUser?.role !== "author") {
		return;
	}

	const nextStatus = parsed.data.isActive === "true";

	if (targetUser.isActive === nextStatus) {
		return;
	}

	await db
		.update(users)
		.set({
			isActive: nextStatus,
			updatedAt: new Date(),
		})
		.where(eq(users.id, targetUser.id));

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
	revalidatePath(`/authors/${targetUser.slug}`);
	revalidatePath("/dashboard", "layout");
}
