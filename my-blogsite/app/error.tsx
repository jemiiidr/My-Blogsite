"use client";

import Link from "next/link";
import { useEffect } from "react";

const errorDecorationIds = [
	"error-decoration-one",
	"error-decoration-two",
	"error-decoration-three",
	"error-decoration-four",
	"error-decoration-five",
	"error-decoration-six",
];

type ErrorPageProps = {
	error: Error & {
		digest?: string;
	};
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		console.error("Page error:", error);
	}, [error]);

	return (
		<main className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-20 bg-background"
			/>

			<div
				aria-hidden="true"
				className="absolute top-0 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
			/>

			<div className="mx-auto w-full max-w-3xl">
				<section className="overflow-hidden rounded-3xl border border-border bg-surface/90 shadow-2xl backdrop-blur-xl">
					<header className="border-border border-b px-6 py-4 sm:px-10">
						<div className="flex items-center gap-2">
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-red-500"
							/>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-amber-500"
							/>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full bg-emerald-500"
							/>

							<span className="ml-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
								Application error
							</span>
						</div>
					</header>

					<div className="px-6 py-12 sm:px-10 sm:py-16">
						<p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
							Something went wrong
						</p>

						<h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							Oops! Something went wrong.
						</h1>

						<p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
							An unexpected error occurred while loading this page. Try
							reloading the content or return to the homepage.
						</p>

						{error.digest ? (
							<p className="mt-5 font-mono text-muted-foreground text-xs">
								Error reference: {error.digest}
							</p>
						) : null}

						<div className="mt-10 flex flex-col gap-3 sm:flex-row">
							<button
								type="button"
								onClick={reset}
								className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 font-semibold text-background text-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
							>
								Try again
							</button>

							<Link
								href="/"
								className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-background px-6 font-semibold text-foreground text-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
							>
								Return home
							</Link>
						</div>
					</div>

					<div
						aria-hidden="true"
						className="grid grid-cols-6 border-border border-t"
					>
						{errorDecorationIds.map((decorationId) => (
							<div
								key={decorationId}
								className="h-3 border-border border-r bg-surface-muted last:border-r-0"
							/>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
