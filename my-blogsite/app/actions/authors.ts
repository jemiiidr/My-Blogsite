"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
	authorStatusSchema,
	promoteUserToAuthorSchema,
} from "@/lib/validations/author";

export async function promoteUserToAuthor(formData: FormData): Promise<void> {
	await requireAdmin();

	const parsed = promoteUserToAuthorSchema.safeParse({
		userId: formData.get("userId"),
	});

	if (!parsed.success) {
		throw new Error("Select a valid user to promote.");
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
		throw new Error(
			"This user is unavailable, inactive, or already has author access.",
		);
	}

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
	revalidatePath("/dashboard", "layout");
}

export async function toggleAuthorStatus(formData: FormData): Promise<void> {
	await requireAdmin();

	const parsed = authorStatusSchema.safeParse({
		userId: formData.get("userId"),
		isActive: formData.get("isActive"),
	});

	if (!parsed.success) {
		throw new Error("Invalid author status request.");
	}

	const [targetAuthor] = await db
		.select({
			id: users.id,
			role: users.role,
			slug: users.slug,
			isActive: users.isActive,
		})
		.from(users)
		.where(eq(users.id, parsed.data.userId))
		.limit(1);

	if (!targetAuthor) {
		throw new Error("Author account not found.");
	}

	if (targetAuthor.role !== "author") {
		throw new Error("Only author accounts can be enabled or disabled.");
	}

	const nextStatus = parsed.data.isActive === "true";

	if (targetAuthor.isActive === nextStatus) {
		return;
	}

	await db
		.update(users)
		.set({
			isActive: nextStatus,
			updatedAt: new Date(),
		})
		.where(and(eq(users.id, targetAuthor.id), eq(users.role, "author")));

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
	revalidatePath(`/authors/${targetAuthor.slug}`);
	revalidatePath("/dashboard", "layout");
}
