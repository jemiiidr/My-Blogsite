export function PostContent({ html }: { html: string }) {
	return (
		<div
			className="text-[1.05rem] leading-8 text-foreground/90 [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-accent-soft [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-lg [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1.5 [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:my-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-950 [&_pre]:p-5 [&_pre]:text-zinc-100 [&_strong]:font-semibold [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
