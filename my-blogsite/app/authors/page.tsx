import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getPublicAuthors } from "@/lib/db/queries/authors";

export const metadata: Metadata = { title: "Authors" };

export default async function AuthorsPage() {
	const authors = await getPublicAuthors();
	return (
		<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
					Our voices
				</p>
				<h1 className="mt-4 text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">
					Meet the people behind the stories.
				</h1>
			</div>
			<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{authors.map((author, index) => (
					<Reveal key={author.id} delay={index * 0.04}>
						<Link
							href={`/authors/${author.slug}`}
							className="group block rounded-[1.75rem] border bg-surface p-7 transition hover:-translate-y-1 hover:shadow-xl"
						>
							<Avatar name={author.name} src={author.avatarUrl} size={76} />
							<p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
								{author.role}
							</p>
							<h2 className="mt-2 text-2xl font-semibold group-hover:text-accent">
								{author.name}
							</h2>
							<p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
								{author.bio || "LUCID contributing author."}
							</p>
							<span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
								View profile <ArrowRightIcon className="size-4" />
							</span>
						</Link>
					</Reveal>
				))}
			</div>
		</div>
	);
}
