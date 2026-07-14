import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { requireAuthor } from "@/lib/auth/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await requireAuthor();
	return (
		<div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-12">
			<DashboardSidebar user={user} />
			<section className="min-w-0">{children}</section>
		</div>
	);
}
