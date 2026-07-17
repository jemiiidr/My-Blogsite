import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { getApprovedCommentsPage } from "@/lib/db/queries/comments";
import { formatDate } from "@/lib/utils/format-date";

export async function CommentList({
	postId,
	slug,
	page,
}: {
	postId: string;
	slug: string;
	page: number;
}) {
	const result = await getApprovedCommentsPage(postId, page);

	if (!result.comments.length) {
		return (
			<div className="rounded-[1.75rem] border border-dashed p-8 text-center text-sm text-muted">
				No comments yet. Start the conversation.
			</div>
		);
	}

	return (
		<div>
			<div className="space-y-4">
				{result.comments.map((comment) => (
					<article
						key={comment.id}
						className="rounded-[1.5rem] border bg-surface p-5"
					>
						<div className="flex items-center gap-3">
							<Avatar
								name={comment.user?.name ?? comment.authorName}
								src={comment.user?.avatarUrl}
								size={40}
							/>
							<div>
								{comment.user?.slug && comment.user.role !== "user" ? (
									<Link
										href={`/authors/${comment.user.slug}`}
										className="text-sm font-semibold hover:text-accent"
									>
										{comment.user.name}
									</Link>
								) : (
									<p className="text-sm font-semibold">{comment.authorName}</p>
								)}
								<p className="text-xs text-muted">
									{formatDate(comment.createdAt)}
								</p>
							</div>
						</div>
						<p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">
							{comment.body}
						</p>
					</article>
				))}
			</div>

			<Pagination
				basePath={`/blog/${slug}`}
				currentPage={result.currentPage}
				totalPages={result.totalPages}
				pageParam="commentPage"
				anchor="comments"
			/>
		</div>
	);
}
