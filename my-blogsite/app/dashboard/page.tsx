import Link from "next/link";

import { RecentComments } from "@/components/dashboard/recent-comments";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopPosts } from "@/components/dashboard/top-posts";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { requireAuthor } from "@/lib/auth/permissions";
import { getDashboardAnalytics } from "@/lib/db/queries/analytics";

export default async function DashboardPage() {
	const user = await requireAuthor();
	const analytics = await getDashboardAnalytics(user);
	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
						Dashboard
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
						Welcome back, {user.name.split(" ")[0]}.
					</h1>
					<p className="mt-2 text-muted">
						A clear view of your stories and audience.
					</p>
				</div>
				<Link
					href="/dashboard/posts/new"
					className="rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition hover:-translate-y-0.5"
				>
					Create new story
				</Link>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard label="Total views" value={analytics.totals.views} />
				<StatCard
					label="Published stories"
					value={analytics.totals.published}
				/>
				<StatCard label="Likes" value={analytics.totals.likes} />
				<StatCard label="Comments" value={analytics.totals.comments} />
			</div>
			<div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
				<ViewsChart data={analytics.viewsByDate} />
				<TopPosts posts={analytics.topPosts} />
			</div>
			<div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
				<div className="rounded-3xl border bg-surface p-5 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-semibold">Your content</h2>
							<p className="text-sm text-muted">Recently updated stories</p>
						</div>
						<Link
							href="/dashboard/posts"
							className="text-sm font-semibold text-accent"
						>
							View all
						</Link>
					</div>
					<div className="mt-4 divide-y">
						{analytics.posts.slice(0, 6).map((post) => (
							<div
								key={post.id}
								className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{post.title}</p>
									<p className="text-xs capitalize text-muted">
										{post.status} · {post.engagement.views} views ·{" "}
										{post.comments} comments
									</p>
								</div>
								<Link
									href={`/dashboard/posts/${post.id}/edit`}
									className="text-sm font-semibold text-accent"
								>
									Edit
								</Link>
							</div>
						))}
					</div>
				</div>
				{user.role === "admin" ? (
					<RecentComments comments={analytics.recentComments} />
				) : null}
			</div>
		</div>
	);
}
