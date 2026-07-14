import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden border-b">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(168,137,255,0.26),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(80,220,235,0.22),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(255,154,190,0.22),transparent_38%)]" />
			<div className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
				<div>
					<Reveal>
						<p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
							Ideas that stay with you
						</p>
					</Reveal>
					<Reveal delay={0.08}>
						<h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
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
							className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-semibold text-background transition hover:-translate-y-1"
						>
							Explore stories <ArrowRightIcon className="size-4" />
						</Link>
						<Link
							href="/authors"
							className="rounded-full border bg-surface/80 px-6 py-3 font-semibold backdrop-blur transition hover:-translate-y-1 hover:border-accent hover:text-accent"
						>
							Meet the authors
						</Link>
					</Reveal>
				</div>
				<Reveal delay={0.12} className="relative hidden min-h-[500px] lg:block">
					<div className="absolute left-8 top-12 h-72 w-64 rotate-[-8deg] rounded-[2.5rem] border bg-gradient-to-br from-violet-300 via-fuchsia-200 to-cyan-200 p-6 shadow-2xl dark:from-violet-900 dark:via-fuchsia-950 dark:to-cyan-950">
						<div className="h-full rounded-[1.8rem] border border-white/40 bg-white/35 p-5 backdrop-blur dark:bg-black/20">
							<p className="text-xs font-semibold uppercase tracking-widest">
								Featured
							</p>
							<p className="mt-24 text-3xl font-semibold leading-tight">
								Stories designed to make you pause.
							</p>
						</div>
					</div>
					<div className="absolute bottom-4 right-0 h-80 w-72 rotate-[6deg] rounded-[2.5rem] border bg-surface p-6 shadow-2xl">
						<div className="h-40 rounded-[1.75rem] bg-gradient-to-br from-sky-300 via-violet-300 to-rose-300 dark:from-sky-900 dark:via-violet-900 dark:to-rose-900" />
						<p className="mt-6 text-xs uppercase tracking-widest text-muted">
							Latest perspective
						</p>
						<p className="mt-2 text-2xl font-semibold">
							Build a more curious reading habit.
						</p>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
