import Link from "next/link";

import { getCategories } from "@/lib/db/queries/categories";

const gradients = [
	"from-violet-200 to-fuchsia-100",//dark:from-violet-950 dark:to-fuchsia-950
	"from-cyan-200 to-blue-100", // dark:from-cyan-950 dark:to-blue-950
	"from-rose-200 to-orange-100", //dark:from-rose-950 dark:to-orange-950
	"from-emerald-200 to-lime-100", // dark:from-emerald-950 dark:to-lime-950
	"from-amber-200 to-yellow-100", //dark:from-amber-950 dark:to-yellow-950
];

export async function CategoryStrip() {
	const categories = await getCategories();
	if (!categories.length) return null;
	return (
		<section className="border-y bg-surface py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-7 flex items-center justify-between">
					<h2 className="text-2xl font-semibold tracking-tight">
						Explore by category
					</h2>
					<Link href="/blog" className="text-sm font-medium text-accent">
						Browse all
					</Link>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{categories.map((category, index) => (
						<Link
							key={category.id}
							href={`/blog?category=${category.slug}`}
							className={`group min-h-36 rounded-3xl border bg-linear-to-br p-5 transition hover:-translate-y-1 ${gradients[index % gradients.length]}`}
						>
							<div className="grid size-10 place-items-center rounded-xl font-semibold backdrop-blur ">
								{String(index + 1).padStart(2, "0")}
							</div>
							<p className="mt-7 font-semibold group-hover:text-accent">
								{category.name}
							</p>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
