import Link from "next/link";

const notFoundDecorationIds = [
	"not-found-decoration-one",
	"not-found-decoration-two",
	"not-found-decoration-three",
	"not-found-decoration-four",
	"not-found-decoration-five",
	"not-found-decoration-six",
];

export default function NotFoundPage() {
	return (
		<main className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-20 bg-background"
			/>

			<div
				aria-hidden="true"
				className="absolute left-1/2 top-0 -z-10 size-96 -translate-x-1/2 rounded-full bg-accent/12 blur-3xl"
			/>

			<div
				aria-hidden="true"
				className="absolute -bottom-36 -left-28 -z-10 size-80 rounded-full bg-accent-soft blur-3xl"
			/>

			<div className="mx-auto w-full max-w-3xl">
				<section className="overflow-hidden rounded-4xl border border-border bg-surface/90 shadow-2xl backdrop-blur-xl">
					<header className="border-b border-border px-6 py-4 sm:px-10">
						<div className="flex items-center gap-2">
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-rose-500"
							/>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-amber-500"
							/>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-emerald-500"
							/>

							<span className="ml-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
								Page not found
							</span>
						</div>
					</header>

					<div className="relative px-6 py-12 sm:px-10 sm:py-16">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute right-5 top-4 select-none text-[8rem] font-black leading-none tracking-tighter text-accent/7 sm:right-10 sm:text-[11rem]"
						>
							404
						</div>

						<div className="relative">
							<p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
								Lost between the pages
							</p>

							<h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Oops! Page not found.
							</h1>

							<p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg">
								The page may have been moved, deleted, left as a draft, or the
								address may be incorrect. Explore the latest stories or return
								to the homepage.
							</p>

							<div className="mt-10 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/blog"
									className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition hover:scale-[1.02] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
								>
									Explore stories
								</Link>

								<Link
									href="/"
									className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-surface-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								>
									Return home
								</Link>
							</div>

							<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted">
								<span>Check the page address</span>
								<span
									aria-hidden="true"
									className="hidden size-1 rounded-full bg-border sm:block"
								/>
								<span>Browse published articles</span>
								<span
									aria-hidden="true"
									className="hidden size-1 rounded-full bg-border sm:block"
								/>
								<span>Discover featured authors</span>
							</div>
						</div>
					</div>

					<div
						aria-hidden="true"
						className="grid grid-cols-6 border-t border-border"
					>
						{notFoundDecorationIds.map((decorationId) => (
							<div
								key={decorationId}
								className="h-3 border-r border-border bg-surface-muted last:border-r-0"
							/>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
