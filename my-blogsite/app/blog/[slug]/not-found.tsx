import Link from "next/link";

export default function PostNotFound() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-32 text-center">
			<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">404</p>
			<h1 className="mt-4 text-5xl font-semibold tracking-tight">This story could not be found.</h1>
			<p className="mt-5 text-muted">It may be unpublished, archived, or the link may be incorrect.</p>
			<Link href="/blog" className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 font-semibold text-background">Browse stories</Link>
		</div>
	);
}
