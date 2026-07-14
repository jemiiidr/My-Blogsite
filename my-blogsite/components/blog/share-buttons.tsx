"use client";

import { startTransition, useState } from "react";

import { recordShare } from "@/app/actions/engagement";
import { CheckIcon, ShareIcon } from "@/components/ui/icons";

type Channel = "copy" | "native" | "facebook" | "x" | "linkedin";

export function ShareButtons({
	postId,
	slug,
	title,
}: {
	postId: string;
	slug: string;
	title: string;
}) {
	const [copied, setCopied] = useState(false);

	function track(channel: Channel) {
		startTransition(() => void recordShare({ postId, slug, channel }));
	}

	async function share() {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({ title, url });
			track("native");
			return;
		}
		await navigator.clipboard.writeText(url);
		setCopied(true);
		track("copy");
		window.setTimeout(() => setCopied(false), 1800);
	}

	return (
		<button
			type="button"
			onClick={() => void share()}
			className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
		>
			{copied ? <CheckIcon className="size-4" /> : <ShareIcon className="size-4" />}
			{copied ? "Copied" : "Share"}
		</button>
	);
}
