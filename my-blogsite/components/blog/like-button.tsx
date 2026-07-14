"use client";

import Link from "next/link";
import { useActionState } from "react";

import { toggleLike, type LikeState } from "@/app/actions/engagement";
import { HeartIcon } from "@/components/ui/icons";

export function LikeButton({
	postId,
	slug,
	initialLiked,
}: {
	postId: string;
	slug: string;
	initialLiked: boolean;
}) {
	const initialState: LikeState = { liked: initialLiked };
	const [state, formAction, pending] = useActionState(toggleLike, initialState);

	return (
		<div>
			<form action={formAction}>
				<input type="hidden" name="postId" value={postId} />
				<input type="hidden" name="slug" value={slug} />
				<button
					type="submit"
					disabled={pending}
					className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${state.liked ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300" : "bg-surface"}`}
				>
					<HeartIcon
						className={`size-4 ${state.liked ? "fill-current" : ""}`}
					/>
					{pending ? "Saving..." : state.liked ? "Liked" : "Like"}
				</button>
			</form>
			{state.requiresLogin ? (
				<p className="mt-2 text-xs text-muted">
					<Link
						className="font-semibold text-accent"
						href={`/login?next=/blog/${slug}`}
					>
						Log in
					</Link>{" "}
					to like this story.
				</p>
			) : null}
		</div>
	);
}
