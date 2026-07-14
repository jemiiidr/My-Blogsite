"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";
import { commentSchema } from "@/lib/validations/comment";

export type CommentActionState = {
	success: boolean;
	message?: string;
	fieldErrors?: {
		authorName?: string[];
		body?: string[];
	};
};

export const initialCommentState: CommentActionState = { success: false };

export async function addComment(
	_previousState: CommentActionState,
	formData: FormData,
): Promise<CommentActionState> {
	const parsed = commentSchema.safeParse({
		postId: formData.get("postId"),
		slug: formData.get("slug"),
		authorName: formData.get("authorName"),
		body: formData.get("body"),
	});

	if (!parsed.success) {
		return {
			success: false,
			fieldErrors: parsed.error.flatten().fieldErrors,
			message: "Please correct the highlighted fields.",
		};
	}

	const [post] = await db
		.select({ id: posts.id })
		.from(posts)
		.where(eq(posts.id, parsed.data.postId))
		.limit(1);

	if (!post) {
		return { success: false, message: "This post no longer exists." };
	}

	const currentUser = await getCurrentUser();
	await db.insert(comments).values({
		postId: parsed.data.postId,
		authorName: currentUser?.name ?? parsed.data.authorName,
		body: parsed.data.body,
		userId: currentUser?.id ?? null,
		approved: true,
	});

	revalidatePath(`/blog/${parsed.data.slug}`);
	revalidatePath("/dashboard");
	return { success: true, message: "Your comment has been posted." };
}
