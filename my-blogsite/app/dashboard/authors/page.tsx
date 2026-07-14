import Link from "next/link";

import { toggleAuthorStatus } from "@/app/actions/authors";
import { CreateAuthorForm } from "@/components/authors/create-author-form";
import { Avatar } from "@/components/ui/avatar";
import { requireAuthor } from "@/lib/auth/permissions";
import { getAuthors } from "@/lib/db/queries/authors";
import { formatDate } from "@/lib/utils/format-date";

export const metadata = { title: "Manage authors" };

export default async function ManageAuthorsPage() {
	const user = await requireAuthor();
	const authors = await getAuthors();
	return <div className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Administration</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Manage authors</h1><p className="mt-2 text-muted">Create writing accounts and control access.</p></div>{user.role === "admin" ? <CreateAuthorForm /> : <div className="rounded-3xl border bg-accent-soft p-5 text-sm text-muted">You can view the complete author directory. Only administrators can create, enable, or disable author accounts.</div>}<div className="overflow-hidden rounded-3xl border bg-surface shadow-sm"><div className="border-b p-5"><h2 className="font-semibold">Author directory</h2></div><div className="divide-y">{authors.map((author) => <div key={author.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><Avatar name={author.name} src={author.avatarUrl} size={48} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Link href={`/authors/${author.slug}`} className="font-semibold hover:text-accent">{author.name}</Link><span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold uppercase text-accent">{author.role}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${author.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"}`}>{author.isActive ? "Active" : "Disabled"}</span></div><p className="truncate text-sm text-muted">{author.email} · Joined {formatDate(author.createdAt)}</p></div>{user.role === "admin" ? <form action={toggleAuthorStatus}><input type="hidden" name="userId" value={author.id} /><input type="hidden" name="isActive" value={author.isActive ? "false" : "true"} /><button type="submit" className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent">{author.isActive ? "Disable" : "Enable"}</button></form> : null}</div>)}</div></div></div>;
}
