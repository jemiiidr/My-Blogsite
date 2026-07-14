import { MessageIcon } from "@/components/ui/icons";
import { getCommentCount } from "@/lib/db/queries/posts";
import { formatCompactNumber } from "@/lib/utils/format-date";

export async function CommentCount({ postId }: { postId: string }) {
	const value = await getCommentCount(postId);
	return (
		<span className="inline-flex items-center gap-1.5">
			<MessageIcon className="size-4" /> {formatCompactNumber(value)}
		</span>
	);
}
