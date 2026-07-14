"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { profileSchema } from "@/lib/validations/profile";

export type ProfileState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(
	_previousState: ProfileState,
	formData: FormData,
): Promise<ProfileState> {
	const user = await requireUser();
	const parsed = profileSchema.safeParse({
		name: formData.get("name"),
		bio: formData.get("bio"),
		avatarUrl: formData.get("avatarUrl"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct your profile details.",
		};
	}

	await db
		.update(users)
		.set({
			name: parsed.data.name,
			bio: parsed.data.bio,
			avatarUrl: parsed.data.avatarUrl || null,
			updatedAt: new Date(),
		})
		.where(eq(users.id, user.id));

	revalidatePath("/profile");
	revalidatePath("/", "layout");
	revalidatePath(`/authors/${user.slug}`);
	return { success: true, message: "Profile updated." };
}
