import type { Metadata } from "next";
import { Suspense } from "react";

import { PostCardSkeleton } from "@/components/blog/post-card-skeleton";
import { PostGrid } from "@/components/blog/post-grid";
import { SearchIcon } from "@/components/ui/icons";
import { getCategories } from "@/lib/db/queries/categories";

export const metadata: Metadata = { title: "Stories" };

type SearchParams = Promise<{
	search?: string;
	category?: string;
	tag?: string;
}>;

async function BlogResults({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	return (
		<PostGrid
			search={params.search}
			category={params.category}
			tag={params.tag}
		/>
	);
}

async function Filters({ searchParams }: { searchParams: SearchParams }) {
	const [params, categories] = await Promise.all([
		searchParams,
		getCategories(),
	]);
	return (
		<form className="grid gap-3 rounded-3xl border bg-surface p-3 md:grid-cols-[1fr_220px_auto]">
			<label className="flex items-center gap-3 rounded-xl bg-background px-4">
				<SearchIcon className="size-4 text-muted" />
				<input
					name="search"
					defaultValue={params.search}
					placeholder="Search stories or authors"
					className="h-12 w-full bg-transparent text-sm"
				/>
			</label>
			<select
				name="category"
				defaultValue={params.category ?? ""}
				className="h-12 rounded-xl border bg-background px-4 text-sm"
			>
				<option value="">All categories</option>
				{categories.map((category) => (
					<option key={category.id} value={category.slug}>
						{category.name}
					</option>
				))}
			</select>
			<button className="h-12 rounded-xl bg-foreground px-6 text-sm font-semibold text-background">
				Apply filters
			</button>
			{params.tag ? (
				<input type="hidden" name="tag" value={params.tag} />
			) : null}
		</form>
	);
}

export default async function BlogPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	await Promise.resolve();
	return (
		<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
			<div className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
					Discover
				</p>
				<h1 className="mt-4 text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">
					Stories for curious minds.
				</h1>
				<p className="mt-5 text-lg leading-8 text-muted">
					Explore perspectives from our authors across technology, design,
					culture, and creativity.
				</p>
			</div>
			<div className="mt-10">
				<Suspense
					fallback={
						<div className="h-20 animate-pulse rounded-3xl bg-surface-muted" />
					}
				>
					<Filters searchParams={searchParams} />
				</Suspense>
			</div>
			<div className="mt-8">
				<Suspense
					fallback={
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, index) => (
								<PostCardSkeleton key={index} />
							))}
						</div>
					}
				>
					<BlogResults searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
}
