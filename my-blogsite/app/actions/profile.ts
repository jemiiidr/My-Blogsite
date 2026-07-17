"use server";

import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { profileSchema } from "@/lib/validations/profile";

export type ProfileState = {
	success: boolean;
	message?: string;
	fieldErrors?: Record<string, string[] | undefined>;
	avatarUrl?: string;
};

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getAvatarExtension(file: File): string {
	const fileExtension = file.name.split(".").pop()?.toLowerCase();

	if (fileExtension && /^[a-z0-9]{2,5}$/.test(fileExtension)) {
		return fileExtension === "jpeg" ? "jpg" : fileExtension;
	}

	const mimeExtension = file.type.split("/")[1]?.replace("jpeg", "jpg");

	if (mimeExtension && /^[a-z0-9]{2,5}$/.test(mimeExtension)) {
		return mimeExtension;
	}

	return "jpg";
}

async function uploadAvatar(file: File, userId: string): Promise<string> {
	const isDevelopment = process.env.NODE_ENV === "development";

	const developmentToken = isDevelopment
		? process.env.BLOB_READ_WRITE_TOKEN
		: undefined;

	if (isDevelopment && !developmentToken) {
		throw new Error(
			"BLOB_READ_WRITE_TOKEN is required for local avatar uploads.",
		);
	}

	const extension = getAvatarExtension(file);

	const blob = await put(`avatars/${userId}.${extension}`, file, {
		access: "public",
		addRandomSuffix: true,
		...(developmentToken
			? {
					token: developmentToken,
				}
			: {}),
	});

	return blob.url;
}

function isVercelBlobUrl(value: string | null | undefined): value is string {
	if (!value) {
		return false;
	}

	try {
		const url = new URL(value);

		return (
			url.protocol === "https:" &&
			url.hostname.endsWith(".blob.vercel-storage.com")
		);
	} catch {
		return false;
	}
}

async function deleteAvatarQuietly(url: string | null | undefined) {
	if (!isVercelBlobUrl(url)) {
		return;
	}

	try {
		const isDevelopment = process.env.NODE_ENV === "development";

		const developmentToken = isDevelopment
			? process.env.BLOB_READ_WRITE_TOKEN
			: undefined;

		await del(
			url,
			developmentToken
				? {
						token: developmentToken,
					}
				: undefined,
		);
	} catch (error) {
		console.error("Avatar cleanup failed:", error);
	}
}

export async function updateProfile(
	_previousState: ProfileState,
	formData: FormData,
): Promise<ProfileState> {
	const user = await requireUser();

	const parsed = profileSchema.safeParse({
		name: formData.get("name"),
		bio: formData.get("bio"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct your profile details.",
		};
	}

	const avatarValue = formData.get("avatar");

	const avatar =
		avatarValue instanceof File && avatarValue.size > 0 ? avatarValue : null;

	if (avatar) {
		if (!ALLOWED_AVATAR_TYPES.has(avatar.type)) {
			return {
				success: false,
				fieldErrors: {
					avatar: ["Only JPG, PNG, and WebP images are allowed."],
				},
				message: "Please select a valid profile picture.",
			};
		}

		if (avatar.size > MAX_AVATAR_SIZE) {
			return {
				success: false,
				fieldErrors: {
					avatar: ["Profile pictures must be 2 MB or smaller."],
				},
				message: "The selected profile picture is too large.",
			};
		}
	}

	const rateLimit = await checkRateLimit({
		action: "profile:update",
		identifier: user.id,
		limit: 20,
		windowMs: 60 * 60 * 1000,
	});

	if (!rateLimit.allowed) {
		return {
			success: false,
			message: "Too many profile updates. Please try again later.",
		};
	}

	const [currentProfile] = await db
		.select({
			avatarUrl: users.avatarUrl,
		})
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	if (!currentProfile) {
		return {
			success: false,
			message: "Your profile could not be found.",
		};
	}

	const previousAvatarUrl = currentProfile.avatarUrl;

	let uploadedAvatarUrl: string | null = null;

	if (avatar) {
		try {
			uploadedAvatarUrl = await uploadAvatar(avatar, user.id);
		} catch (error) {
			console.error("Profile picture upload failed:", error);

			return {
				success: false,
				fieldErrors: {
					avatar: [
						"The profile picture could not be uploaded. Check your Blob configuration and try again.",
					],
				},
				message: "Unable to upload the profile picture.",
			};
		}
	}

	try {
		await db
			.update(users)
			.set({
				name: parsed.data.name,
				bio: parsed.data.bio,
				...(uploadedAvatarUrl
					? {
							avatarUrl: uploadedAvatarUrl,
						}
					: {}),
				updatedAt: new Date(),
			})
			.where(eq(users.id, user.id));
	} catch (error) {
		console.error("Profile database update failed:", error);

		/*
		 * The new image was uploaded, but the database
		 * update failed, so remove the unused Blob.
		 */
		await deleteAvatarQuietly(uploadedAvatarUrl);

		return {
			success: false,
			message: "Failed to save your profile changes.",
		};
	}

	/*
	 * Delete the old uploaded Blob only after the new URL
	 * has been successfully stored in the database.
	 *
	 * Seeded local paths such as:
	 * /images/avatars/jamie.svg
	 *
	 * are ignored because they are not Blob URLs.
	 */
	if (uploadedAvatarUrl && previousAvatarUrl !== uploadedAvatarUrl) {
		await deleteAvatarQuietly(previousAvatarUrl);
	}

	revalidatePath("/profile");
	revalidatePath("/", "layout");
	revalidatePath("/dashboard", "layout");
	revalidatePath(`/authors/${user.slug}`);

	return {
		success: true,
		message: "Profile updated.",
		avatarUrl: uploadedAvatarUrl ?? previousAvatarUrl ?? undefined,
	};
}
