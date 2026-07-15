// biome-ignore-all lint/security/noDangerouslySetInnerHtml: This dedicated component renders HTML sanitized with sanitizeRichText before injection.

import { sanitizeRichText } from "@/lib/utils/sanitize-html";

type PostContentProps = {
	html: string;
};

export function PostContent({ html }: PostContentProps) {
	const safeHtml = sanitizeRichText(html);

	return (
		<article
			className={[
				"mx-auto max-w-3xl text-[1.05rem] leading-8 text-foreground/90",

				"[&_p]:my-5",

				"[&_h2]:mb-4 [&_h2]:mt-12",
				"[&_h2]:text-3xl [&_h2]:font-semibold",
				"[&_h2]:tracking-tight [&_h2]:text-foreground",

				"[&_h3]:mb-3 [&_h3]:mt-9",
				"[&_h3]:text-2xl [&_h3]:font-semibold",
				"[&_h3]:tracking-tight [&_h3]:text-foreground",

				"[&_blockquote]:my-8",
				"[&_blockquote]:rounded-r-2xl",
				"[&_blockquote]:border-l-4",
				"[&_blockquote]:border-accent",
				"[&_blockquote]:bg-accent-soft/60",
				"[&_blockquote]:px-6",
				"[&_blockquote]:py-5",
				"[&_blockquote]:italic",

				"[&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7",
				"[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7",
				"[&_li]:my-2",

				"[&_a]:font-medium",
				"[&_a]:text-accent",
				"[&_a]:underline",
				"[&_a]:underline-offset-4",

				"[&_code]:rounded-md",
				"[&_code]:bg-surface-muted",
				"[&_code]:px-1.5",
				"[&_code]:py-0.5",
				"[&_code]:font-mono",
				"[&_code]:text-[0.9em]",

				"[&_pre]:my-8",
				"[&_pre]:overflow-x-auto",
				"[&_pre]:rounded-2xl",
				"[&_pre]:bg-zinc-950",
				"[&_pre]:p-5",
				"[&_pre]:text-zinc-100",
				"[&_pre_code]:bg-transparent",
				"[&_pre_code]:p-0",

				"[&_hr]:my-10",
				"[&_hr]:border-border",
			].join(" ")}
			dangerouslySetInnerHTML={{
				__html: safeHtml,
			}}
		/>
	);
}
