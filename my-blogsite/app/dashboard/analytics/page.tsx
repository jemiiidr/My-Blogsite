import { StatCard } from "@/components/dashboard/stat-card";
import { TopPosts } from "@/components/dashboard/top-posts";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { requireAuthor } from "@/lib/auth/permissions";
import { getDashboardAnalytics } from "@/lib/db/queries/analytics";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
	const user = await requireAuthor();
	const analytics = await getDashboardAnalytics(user);
	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Performance
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight">
					Story analytics
				</h1>
				<p className="mt-2 text-muted">
					Understand what readers are opening, liking, sharing, and discussing.
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard label="Views" value={analytics.totals.views} />
				<StatCard label="Likes" value={analytics.totals.likes} />
				<StatCard label="Shares" value={analytics.totals.shares} />
				<StatCard label="Drafts" value={analytics.totals.drafts} />
			</div>
			<div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
				<ViewsChart data={analytics.viewsByDate} />
				<TopPosts posts={analytics.topPosts} />
			</div>
		</div>
	);
}
