"use server";

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { slugify } from "@/lib/utils/slugify";
import {
	authorStatusSchema,
	createAuthorSchema,
} from "@/lib/validations/author";

export type AuthorActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[] | undefined>;
};

export async function createAuthor(
	_previousState: AuthorActionState,
	formData: FormData,
): Promise<AuthorActionState> {
	await requireAdmin();

	const parsed = createAuthorSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		bio: formData.get("bio"),
		avatarUrl: formData.get("avatarUrl"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: z.flattenError(parsed.error).fieldErrors,
			message: "Please correct the author details.",
		};
	}

	const email = parsed.data.email.toLowerCase();

	const [existingUser] = await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existingUser) {
		return {
			success: false,
			fieldErrors: {
				email: ["An account already uses this email address."],
			},
			message: "The author account could not be created.",
		};
	}

	const baseSlug = slugify(parsed.data.name) || "author";
	const uniqueSuffix = randomUUID().slice(0, 8);
	const slug = `${baseSlug}-${uniqueSuffix}`;

	await db.insert(users).values({
		name: parsed.data.name,
		email,
		passwordHash: hashPassword(parsed.data.password),
		role: "author",
		slug,
		avatarUrl: parsed.data.avatarUrl || "/images/avatars/default-author.svg",
		bio: parsed.data.bio,
	});

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
	revalidatePath("/dashboard", "layout");

	return {
		success: true,
		message: "Author account created.",
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

	if (!targetUser) {
		return;
	}

	if (targetUser.role !== "author") {
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
