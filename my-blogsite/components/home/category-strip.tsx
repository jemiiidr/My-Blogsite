import Link from "next/link";

import { getCategories } from "@/lib/db/queries/categories";

const categoryGradients = [
	"category-gradient-violet",
	"category-gradient-cyan",
	"category-gradient-rose",
	"category-gradient-emerald",
	"category-gradient-amber",
] as const;

export async function CategoryStrip() {
	const categories = await getCategories();

	if (!categories.length) {
		return null;
	}

	return (
		<section className="border-y border-border bg-surface py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-7 flex items-center justify-between gap-4">
					<h2 className="text-2xl font-semibold tracking-tight text-foreground">
						Explore by category
					</h2>

					<Link
						href="/blog"
						className="text-sm font-medium text-accent hover:opacity-75"
					>
						Browse all
					</Link>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{categories.map((category, index) => {
						const gradient =
							categoryGradients[
								index % categoryGradients.length
							];

						return (
							<Link
								key={category.id}
								href={`/blog?category=${category.slug}`}
								className={`
									${gradient}
									group min-h-36 rounded-3xl border border-border
									p-5 text-foreground shadow-sm
									transition duration-300
									hover:-translate-y-1
									hover:border-accent/40
									hover:shadow-lg
								`}
							>
								<div
									className="
										grid size-10 place-items-center rounded-xl
										border border-border bg-surface/50
										text-sm font-semibold
										backdrop-blur-md
									"
								>
									{String(index + 1).padStart(2, "0")}
								</div>

								<p className="mt-7 font-semibold transition-colors group-hover:text-accent">
									{category.name}
								</p>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}