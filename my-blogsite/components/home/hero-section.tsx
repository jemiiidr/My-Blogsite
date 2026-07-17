import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden border-b border-border">
			<div
				className="
					absolute inset-0 -z-10
					bg-[radial-gradient(circle_at_20%_20%,var(--hero-glow-violet),transparent_34%),radial-gradient(circle_at_80%_30%,var(--hero-glow-cyan),transparent_30%),radial-gradient(circle_at_50%_90%,var(--hero-glow-rose),transparent_38%)]
				"
			/>

			<div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
				<div>
					<Reveal>
						<p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
							Ideas that stay with you
						</p>
					</Reveal>

					<Reveal delay={0.08}>
						<h1 className="max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[6.5rem]">
							Explore new worlds of thought.
						</h1>
					</Reveal>

					<Reveal delay={0.16}>
						<p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
							Discover thoughtful stories about creativity, technology, design,
							culture, and the ideas shaping our everyday lives.
						</p>
					</Reveal>

					<Reveal delay={0.24} className="mt-9 flex flex-wrap gap-3">
						<Link
							href="/blog"
							className="
								inline-flex items-center gap-2 rounded-full
								bg-foreground px-6 py-3 font-semibold
								text-background transition
								hover:-translate-y-1
							"
						>
							Explore stories
							<ArrowRightIcon className="size-4" />
						</Link>

						<Link
							href="/authors"
							className="
								rounded-full border border-border
								bg-surface/80 px-6 py-3 font-semibold
								text-foreground backdrop-blur
								transition hover:-translate-y-1
								hover:border-accent hover:text-accent
							"
						>
							Meet the authors
						</Link>
					</Reveal>
				</div>

				<Reveal delay={0.12} className="relative hidden min-h-125 lg:block">
					<div
						className="
							absolute top-12 left-8 h-72 w-64
							rotate-[-8deg] rounded-[2.5rem]
							border border-border
							bg-linear-to-br
							from-(--hero-featured-from)
							via-(--hero-featured-via)
							to-(--hero-featured-to)
							p-6 shadow-2xl
						"
					>
						<div
							className="
								h-full rounded-[1.8rem]
								border border-(--hero-glass-border)
								bg-(--hero-glass-background)
								p-5 backdrop-blur
							"
						>
							<p className="text-xs font-semibold uppercase tracking-widest text-foreground">
								Featured
							</p>

							<p className="mt-5 text-3xl leading-tight font-semibold text-foreground">
								Stories designed to make you pause.
							</p>
						</div>
					</div>

					<div
						className="
							absolute right-0 bottom-4 h-80 w-72
							rotate-6 rounded-[2.5rem]
							border border-border bg-surface
							p-6 shadow-2xl
						"
					>
						<div
							className="
								h-40 rounded-[1.75rem]
								bg-linear-to-br
								from-(--hero-latest-from)
								via-(--hero-latest-via)
								to-(--hero-latest-to)
							"
						/>

						<p className="mt-6 text-xs uppercase tracking-widest text-muted">
							Latest perspective
						</p>

						<p className="mt-2 text-2xl font-semibold text-foreground">
							Build a more curious reading habit.
						</p>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
