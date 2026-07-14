"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { moderateCommentSchema } from "@/lib/validations/engagement";

export async function toggleCommentApproval(formData: FormData) {
	await requireAdmin();
	const parsed = moderateCommentSchema.safeParse({
		commentId: formData.get("commentId"),
		postSlug: formData.get("postSlug"),
		approved: formData.get("approved"),
	});
	if (!parsed.success) return;

	await db
		.update(comments)
		.set({ approved: parsed.data.approved === "true" })
		.where(eq(comments.id, parsed.data.commentId));

	revalidatePath(`/blog/${parsed.data.postSlug}`);
	revalidatePath("/dashboard/comments");
	revalidatePath("/dashboard");
}
