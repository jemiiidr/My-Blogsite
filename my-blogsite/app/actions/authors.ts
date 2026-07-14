"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
	authorStatusSchema,
	createAuthorSchema,
} from "@/lib/validations/author";
import { slugify } from "@/lib/utils/slugify";

export type AuthorActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[]>;
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
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct the author details.",
		};
	}

	const email = parsed.data.email.toLowerCase();
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (existing) {
		return { success: false, message: "An account already uses that email." };
	}

	const baseSlug = slugify(parsed.data.name) || "author";
	const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

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
	return { success: true, message: "Author account created." };
}

export async function toggleAuthorStatus(formData: FormData) {
	await requireAdmin();
	const parsed = authorStatusSchema.safeParse({
		userId: formData.get("userId"),
		isActive: formData.get("isActive"),
	});
	if (!parsed.success) return;

	await db
		.update(users)
		.set({
			isActive: parsed.data.isActive === "true",
			updatedAt: new Date(),
		})
		.where(eq(users.id, parsed.data.userId));

	revalidatePath("/dashboard/authors");
	revalidatePath("/authors");
}
