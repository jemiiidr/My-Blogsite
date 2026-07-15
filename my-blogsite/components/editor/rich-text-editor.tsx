"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { EditorToolbar } from "@/components/editor/editor-toolbar";

export type RichTextEditorValue = {
	html: string;
	text: string;
};

export function RichTextEditor({
	initialHtml = "<p></p>",
	onChange,
}: {
	initialHtml?: string;
	onChange: (value: RichTextEditorValue) => void;
}) {
	const editor = useEditor({
		immediatelyRender: false,

		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
				},
				link: {
					openOnClick: false,
					autolink: true,
					linkOnPaste: true,
					defaultProtocol: "https",
					HTMLAttributes: {
						class:
							"font-medium text-accent underline decoration-accent/50 underline-offset-4",
						target: "_blank",
						rel: "noopener noreferrer",
					},
				},
			}),

			Placeholder.configure({
				placeholder:
					"Begin with an idea, an observation, or a moment worth sharing...",
			}),
		],

		content: initialHtml || "<p></p>",

		editorProps: {
			attributes: {
				role: "textbox",
				"aria-label": "Story body",
				"aria-multiline": "true",
				class: [
					"min-h-[34rem] px-5 lg:-mt-6 py-3 text-[1.05rem] leading-8 outline-none sm:px-8 sm:py-10",
					"text-foreground/90 caret-accent",

					"[&_p]:my-4",

					"[&_h2]:mb-4 [&_h2]:mt-10",
					"[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight",
					"[&_h2]:text-foreground",

					"[&_h3]:mb-3 [&_h3]:mt-8",
					"[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight",
					"[&_h3]:text-foreground",

					"[&_blockquote]:my-7",
					"[&_blockquote]:rounded-r-2xl",
					"[&_blockquote]:border-l-4 [&_blockquote]:border-accent",
					"[&_blockquote]:bg-accent-soft/70",
					"[&_blockquote]:px-5 [&_blockquote]:py-4",
					"[&_blockquote]:italic [&_blockquote]:text-foreground/85",

					"[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7",
					"[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7",
					"[&_li]:my-1.5",

					"[&_a]:font-medium [&_a]:text-accent",
					"[&_a]:underline [&_a]:underline-offset-4",

					"[&_code]:rounded-md [&_code]:bg-surface-muted",
					"[&_code]:px-1.5 [&_code]:py-0.5",
					"[&_code]:font-mono [&_code]:text-[0.9em]",

					"[&_pre]:my-7 [&_pre]:overflow-x-auto",
					"[&_pre]:rounded-2xl [&_pre]:bg-zinc-950",
					"[&_pre]:p-5 [&_pre]:text-zinc-100",
					"[&_pre_code]:bg-transparent [&_pre_code]:p-0",

					"[&_hr]:my-9 [&_hr]:border-border",

					"[&_.is-editor-empty:first-child::before]:pointer-events-none",
					"[&_.is-editor-empty:first-child::before]:float-left",
					"[&_.is-editor-empty:first-child::before]:h-0",
					"[&_.is-editor-empty:first-child::before]:text-muted/70",
					"[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
				].join(" "),
			},
		},

		onCreate: ({ editor: currentEditor }) => {
			onChange({
				html: currentEditor.getHTML(),
				text: currentEditor.getText({
					blockSeparator: " ",
				}),
			});
		},

		onUpdate: ({ editor: currentEditor }) => {
			onChange({
				html: currentEditor.getHTML(),
				text: currentEditor.getText({
					blockSeparator: " ",
				}),
			});
		},
	});

	return (
		<div className="overflow-hidden rounded-4xl border border-border bg-surface shadow-sm">
			<EditorToolbar editor={editor} />

			<div className="relative">
				{editor ? (
					<EditorContent editor={editor} />
				) : (
					<div className="min-h-136 animate-pulse px-8 py-10">
						<div className="h-5 w-2/3 rounded-full bg-surface-muted" />
						<div className="mt-5 h-4 w-full rounded-full bg-surface-muted" />
						<div className="mt-3 h-4 w-11/12 rounded-full bg-surface-muted" />
						<div className="mt-3 h-4 w-4/5 rounded-full bg-surface-muted" />
					</div>
				)}
			</div>
		</div>
	);
}
