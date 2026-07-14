import Link from "next/link";

import type { User } from "@/lib/db/schema";

const links = [
	{ href: "/dashboard", label: "Overview" },
	{ href: "/dashboard/analytics", label: "Analytics" },
	{ href: "/dashboard/posts", label: "Posts" },
	{ href: "/dashboard/posts/new", label: "Write a story" },
];

export function DashboardSidebar({
	user,
}: {
	user: Pick<User, "name" | "role">;
}) {
	return (
		<aside className="rounded-3xl border bg-surface p-4 shadow-sm lg:sticky lg:top-24 lg:h-fit">
			<div className="mb-4 rounded-2xl bg-gradient-to-br from-accent-soft to-surface-muted p-4">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
					Workspace
				</p>
				<p className="mt-2 font-semibold">{user.name}</p>
				<p className="text-sm capitalize text-muted">{user.role}</p>
			</div>
			<nav className="grid gap-1 text-sm font-medium">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="rounded-xl px-3 py-2.5 transition hover:bg-surface-muted hover:text-accent"
					>
						{link.label}
					</Link>
				))}
				<Link
					href="/dashboard/authors"
					className="rounded-xl px-3 py-2.5 transition hover:bg-surface-muted hover:text-accent"
				>
					Authors
				</Link>
				{user.role === "admin" ? (
					<Link
						href="/dashboard/comments"
						className="rounded-xl px-3 py-2.5 transition hover:bg-surface-muted hover:text-accent"
					>
						Moderate comments
					</Link>
				) : null}
			</nav>
		</aside>
	);
}
