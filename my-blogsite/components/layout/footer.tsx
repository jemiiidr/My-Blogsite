import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export function Footer() {
	return (
		<footer className="mt-24 border-t bg-surface">
			<div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
				<div className="max-w-md space-y-4">
					<Logo />
					<p className="text-sm leading-7 text-muted">
						A modern storytelling platform for thoughtful ideas, creative work,
						and useful perspectives.
					</p>
				</div>
				<div>
					<h2 className="font-semibold">Explore</h2>
					<div className="mt-4 flex flex-col gap-3 text-sm text-muted">
						<Link href="/blog" className="hover:text-accent">
							All stories
						</Link>
						<Link href="/authors" className="hover:text-accent">
							Authors
						</Link>
						<Link href="/login" className="hover:text-accent">
							Log in
						</Link>
					</div>
				</div>
				<div>
					<h2 className="font-semibold">Build notes</h2>
					<p className="mt-4 text-sm leading-7 text-muted">
						Built with Next.js, Neon Postgres, Drizzle ORM, Server Actions,
						Tailwind CSS, and Motion.
					</p>
				</div>
			</div>
			<div className="border-t px-4 py-6 text-center text-xs text-muted">
				© {new Date().getFullYear()} LUCID. Academic project demonstration.
			</div>
		</footer>
	);
}
