"use client";

import { useFormStatus } from "react-dom";

export function CommentSubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{pending ? "Posting comment..." : "Post comment"}
		</button>
	);
}
