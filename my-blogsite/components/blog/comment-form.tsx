"use client";

import { useActionState, useEffect, useRef } from "react";

import { addComment, initialCommentState } from "@/app/actions/comments";
import { CommentSubmitButton } from "@/components/blog/comment-submit-button";
import { FieldError } from "@/components/ui/field-error";

export function CommentForm({
	postId,
	slug,
	defaultAuthorName,
}: {
	postId: string;
	slug: string;
	defaultAuthorName?: string;
}) {
	const [state, formAction] = useActionState(addComment, initialCommentState);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success) formRef.current?.reset();
	}, [state.success]);

	return (
		<form
			ref={formRef}
			action={formAction}
			className="rounded-[1.75rem] border bg-surface p-5 sm:p-7"
		>
			<input type="hidden" name="postId" value={postId} />
			<input type="hidden" name="slug" value={slug} />
			<div>
				<label htmlFor="authorName" className="text-sm font-medium">
					Name
				</label>
				<input
					id="authorName"
					name="authorName"
					defaultValue={defaultAuthorName}
					readOnly={Boolean(defaultAuthorName)}
					placeholder="How should we call you?"
					className="mt-2 w-full rounded-2xl border bg-background px-4 py-3 text-sm placeholder:text-muted/70 read-only:opacity-70"
				/>
				<FieldError errors={state.fieldErrors?.authorName} />
			</div>
			<div className="mt-5">
				<label htmlFor="commentBody" className="text-sm font-medium">
					Comment
				</label>
				<textarea
					id="commentBody"
					name="body"
					rows={5}
					placeholder="Share a thoughtful response..."
					className="mt-2 w-full resize-y rounded-2xl border bg-background px-4 py-3 text-sm leading-6 placeholder:text-muted/70"
				/>
				<FieldError errors={state.fieldErrors?.body} />
			</div>
			<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
				<p
					className={`text-sm ${state.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
					role="status"
				>
					{state.message}
				</p>
				<CommentSubmitButton />
			</div>
		</form>
	);
}
