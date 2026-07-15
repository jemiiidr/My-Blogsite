import Link from "next/link";

import { toggleCommentApproval } from "@/app/actions/moderation";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAllCommentsForModeration } from "@/lib/db/queries/comments";
import { formatDate } from "@/lib/utils/format-date";

export const metadata = { title: "Comment moderation" };

export default async function CommentsModerationPage() {
	await requireAdmin();
	const comments = await getAllCommentsForModeration();
	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Community
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight">
					Comment moderation
				</h1>
				<p className="mt-2 text-muted">
					Approve or hide comments from public article pages.
				</p>
			</div>
			<div className="overflow-hidden rounded-3xl border bg-surface shadow-sm">
				<div className="divide-y">
					{comments.length ? (
						comments.map((comment) => (
							<article key={comment.id} className="p-5">
								<div className="flex flex-col justify-between gap-4 sm:flex-row">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-semibold">{comment.authorName}</p>
											<span
												className={`rounded-full px-2 py-1 text-[10px] font-semibold ${comment.approved ? "bg-success text-success-txt" : "bg-hidden text-hidden-txt"}`}
											>
												{comment.approved ? "Visible" : "Hidden"}
											</span>
											<span className="text-xs text-muted">
												{formatDate(comment.createdAt)}
											</span>
										</div>
										<p className="mt-2 text-sm leading-6">{comment.body}</p>
										<Link
											href={`/blog/${comment.postSlug}`}
											className="mt-2 inline-block text-xs font-semibold text-accent"
										>
											On: {comment.postTitle}
										</Link>
									</div>
									<form action={toggleCommentApproval} className="shrink-0">
										<input type="hidden" name="commentId" value={comment.id} />
										<input
											type="hidden"
											name="postSlug"
											value={comment.postSlug}
										/>
										<input
											type="hidden"
											name="approved"
											value={comment.approved ? "false" : "true"}
										/>
										<button
											type="submit"
											className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
										>
											{comment.approved ? "Hide" : "Approve"}
										</button>
									</form>
								</div>
							</article>
						))
					) : (
						<p className="p-12 text-center text-sm text-muted">
							No comments to moderate.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
