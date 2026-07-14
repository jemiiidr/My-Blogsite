import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";

export function AuthorCard({
	author,
}: {
	author: { name: string; slug: string; avatarUrl: string | null; bio: string };
}) {
	return (
		<aside className="rounded-[1.75rem] border bg-surface p-6">
			<div className="flex items-center gap-4">
				<Avatar name={author.name} src={author.avatarUrl} size={58} />
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
						Written by
					</p>
					<Link
						href={`/authors/${author.slug}`}
						className="text-lg font-semibold hover:text-accent"
					>
						{author.name}
					</Link>
				</div>
			</div>
			<p className="mt-4 text-sm leading-7 text-muted">
				{author.bio || "A contributing writer at LUCID."}
			</p>
		</aside>
	);
}
