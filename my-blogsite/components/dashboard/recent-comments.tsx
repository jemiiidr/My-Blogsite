import { formatDate } from "@/lib/utils/format-date";

export function RecentComments({
	comments,
}: {
	comments: Array<{
		id: string;
		authorName: string;
		body: string;
		createdAt: Date;
		approved: boolean;
	}>;
}) {
	return (
		<div className="rounded-3xl border bg-surface p-5 shadow-sm">
			<h2 className="font-semibold">Recent comments</h2>
			<div className="mt-4 space-y-3">
				{comments.length ? (
					comments.map((comment) => (
						<div key={comment.id} className="rounded-2xl bg-surface-muted p-3">
							<div className="flex items-center justify-between gap-3">
								<p className="text-sm font-semibold">{comment.authorName}</p>
								<span
									className={`rounded-full px-2 py-1 text-[10px] font-semibold ${comment.approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}
								>
									{comment.approved ? "Visible" : "Hidden"}
								</span>
							</div>
							<p className="mt-1 line-clamp-2 text-sm text-muted">
								{comment.body}
							</p>
							<p className="mt-2 text-xs text-muted">
								{formatDate(comment.createdAt)}
							</p>
						</div>
					))
				) : (
					<p className="py-8 text-center text-sm text-muted">
						No comments yet.
					</p>
				)}
			</div>
		</div>
	);
}
