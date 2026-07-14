"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { likes, postViews, shares } from "@/lib/db/schema";
import {
	postEngagementSchema,
	shareSchema,
} from "@/lib/validations/engagement";

export type LikeState = {
	liked: boolean;
	requiresLogin?: boolean;
	message?: string;
};

export async function toggleLike(
	_previousState: LikeState,
	formData: FormData,
): Promise<LikeState> {
	const parsed = postEngagementSchema.safeParse({
		postId: formData.get("postId"),
		slug: formData.get("slug"),
	});
	if (!parsed.success) return { liked: false, message: "Invalid post." };

	const user = await getCurrentUser();
	if (!user) {
		return {
			liked: false,
			requiresLogin: true,
			message: "Log in to like this story.",
		};
	}

	const [existing] = await db
		.select({ id: likes.id })
		.from(likes)
		.where(and(eq(likes.postId, parsed.data.postId), eq(likes.userId, user.id)))
		.limit(1);

	if (existing) {
		await db.delete(likes).where(eq(likes.id, existing.id));
	} else {
		await db
			.insert(likes)
			.values({ postId: parsed.data.postId, userId: user.id });
	}

	revalidatePath(`/blog/${parsed.data.slug}`);
	revalidatePath("/blog");
	revalidatePath("/dashboard");
	return { liked: !existing };
}

export async function recordPostView(input: { postId: string; slug: string }) {
	const parsed = postEngagementSchema.safeParse(input);
	if (!parsed.success) return;

	const user = await getCurrentUser();
	const cookieStore = await cookies();
	let visitorId = cookieStore.get("lucid_visitor")?.value;
	if (!visitorId) {
		visitorId = randomUUID();
		cookieStore.set("lucid_visitor", visitorId, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
		});
	}

	const condition = user
		? and(
				eq(postViews.postId, parsed.data.postId),
				eq(postViews.userId, user.id),
			)
		: and(
				eq(postViews.postId, parsed.data.postId),
				eq(postViews.visitorId, visitorId),
			);
	const [existing] = await db
		.select({ id: postViews.id })
		.from(postViews)
		.where(condition)
		.limit(1);

	if (!existing) {
		await db.insert(postViews).values({
			postId: parsed.data.postId,
			userId: user?.id ?? null,
			visitorId: user ? null : visitorId,
		});
		revalidatePath(`/blog/${parsed.data.slug}`);
		revalidatePath("/blog");
		revalidatePath("/dashboard");
	}
}

export async function recordShare(input: {
	postId: string;
	slug: string;
	channel: "copy" | "native" | "facebook" | "x" | "linkedin";
}) {
	const parsed = shareSchema.safeParse(input);
	if (!parsed.success) return;

	const user = await getCurrentUser();
	await db.insert(shares).values({
		postId: parsed.data.postId,
		userId: user?.id ?? null,
		channel: parsed.data.channel,
	});

	revalidatePath(`/blog/${parsed.data.slug}`);
	revalidatePath("/dashboard");
}
