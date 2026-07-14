import Link from "next/link";

export default function AuthorNotFound() {
	return (
		<div className="mx-auto max-w-xl px-4 py-32 text-center">
			<h1 className="text-4xl font-semibold">Author not found</h1>
			<Link href="/authors" className="mt-6 inline-block text-accent">
				View all authors
			</Link>
		</div>
	);
}
