"use client";

import { startTransition, useEffect } from "react";

import { recordPostView } from "@/app/actions/engagement";

export function ViewTracker({
	postId,
	slug,
}: {
	postId: string;
	slug: string;
}) {
	useEffect(() => {
		const key = `lucid-viewed:${postId}`;
		if (sessionStorage.getItem(key)) return;
		sessionStorage.setItem(key, "true");
		startTransition(() => {
			void recordPostView({ postId, slug });
		});
	}, [postId, slug]);
	return null;
}
