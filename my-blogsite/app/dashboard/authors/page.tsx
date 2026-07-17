import Link from "next/link";

import { toggleAuthorStatus } from "@/app/actions/authors";
import { CreateAuthorForm } from "@/components/authors/create-author-form";
import { Avatar } from "@/components/ui/avatar";
import { requireAuthor } from "@/lib/auth/permissions";
import {
	getAuthors,
	getUsersAvailableForAuthorRole,
} from "@/lib/db/queries/authors";
import { formatDate } from "@/lib/utils/format-date";

export const metadata = {
	title: "Manage authors",
};

export default async function ManageAuthorsPage() {
	const currentUser = await requireAuthor();

	const [authors, promotableUsers] = await Promise.all([
		getAuthors(),
		getUsersAvailableForAuthorRole(),
	]);

	const isAdmin = currentUser.role === "admin";

	return (
		<div className="space-y-6">
			<header>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Administration
				</p>

				<h1 className="mt-2 text-3xl font-semibold tracking-tight">
					Manage authors
				</h1>

				<p className="mt-2 text-muted">
					Promote registered users and manage author access.
				</p>
			</header>

			{isAdmin ? (
				<CreateAuthorForm users={promotableUsers} />
			) : (
				<div className="rounded-3xl border bg-accent-soft p-5 text-sm text-muted">
					You can view the author directory. Only administrators can promote
					users or manage author access.
				</div>
			)}

			<section className="overflow-hidden rounded-3xl border bg-surface shadow-sm">
				<div className="border-b p-5">
					<h2 className="font-semibold">Author directory</h2>

					<p className="mt-1 text-sm text-muted">
						Authors and administrators with publishing access.
					</p>
				</div>

				{authors.length > 0 ? (
					<div className="divide-y">
						{authors.map((author) => (
							<div
								key={author.id}
								className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
							>
								<Avatar name={author.name} src={author.avatarUrl} size={48} />

								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<Link
											href={`/authors/${author.slug}`}
											className="font-semibold transition-colors hover:text-accent"
										>
											{author.name}
										</Link>

										<span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold uppercase text-accent">
											{author.role}
										</span>

										<span
											className={[
												"rounded-full px-2 py-1 text-[10px] font-semibold",
												author.isActive
													? "bg-success text-success-txt"
													: "bg-fail text-fail-txt",
											].join(" ")}
										>
											{author.isActive ? "Active" : "Disabled"}
										</span>
									</div>

									<p className="mt-1 truncate text-sm text-muted">
										{author.email} · Joined {formatDate(author.createdAt)}
									</p>
								</div>

								{isAdmin ? (
									author.role === "admin" ? (
										<span className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-semibold text-accent">
											Admin
										</span>
									) : (
										<form action={toggleAuthorStatus}>
											<input type="hidden" name="userId" value={author.id} />

											<input
												type="hidden"
												name="isActive"
												value={author.isActive ? "false" : "true"}
											/>

											<button
												type="submit"
												className={[
													"rounded-full border px-4 py-2 text-sm font-semibold transition",
													author.isActive
														? "border-fail text-fail-txt hover:border-fail-txt hover:bg-fail"
														: "border-success text-success-txt hover:border-success-txt hover:bg-success",
												].join(" ")}
											>
												{author.isActive ? "Disable" : "Enable"}
											</button>
										</form>
									)
								) : null}
							</div>
						))}
					</div>
				) : (
					<p className="p-5 text-sm text-muted">
						No authors are currently available.
					</p>
				)}
			</section>
		</div>
	);
}
