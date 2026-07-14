import Image from "next/image";
import Link from "next/link";

import { deletePost } from "@/app/actions/posts";
import { requireAuthor } from "@/lib/auth/permissions";
import { getDashboardPosts } from "@/lib/db/queries/posts";
import { formatDate } from "@/lib/utils/format-date";

export const metadata = { title: "Manage posts" };

export default async function DashboardPostsPage() {
	const user = await requireAuthor();
	const posts = await getDashboardPosts(user);
	return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Content library</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Your stories</h1><p className="mt-2 text-muted">Manage drafts and published work.</p></div><Link href="/dashboard/posts/new" className="rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background">New story</Link></div><div className="overflow-hidden rounded-3xl border bg-surface shadow-sm"><div className="divide-y">{posts.length ? posts.map((post) => <article key={post.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center"><Image src={post.coverImageUrl} alt="" width={160} height={100} className="h-20 w-full rounded-2xl object-cover sm:w-24" /><div className="min-w-0"><div className="mb-1 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${post.status === "published" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}`}>{post.status}</span><span className="text-xs text-muted">Updated {formatDate(post.updatedAt)}</span></div><h2 className="truncate font-semibold">{post.title}</h2><p className="mt-1 text-xs text-muted">{post.engagement.views} views · {post.engagement.likes} likes · {post.comments} comments</p></div><div className="flex gap-2"><Link href={`/dashboard/posts/${post.id}/edit`} className="rounded-full border px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">Edit</Link><form action={deletePost}><input type="hidden" name="postId" value={post.id} /><button type="submit" className="rounded-full border px-4 py-2 text-sm font-semibold text-rose-500 hover:border-rose-400">Delete</button></form></div></article>) : <div className="p-12 text-center"><p className="font-semibold">No stories yet</p><p className="mt-2 text-sm text-muted">Open the editor and publish your first article.</p></div>}</div></div></div>;
}
