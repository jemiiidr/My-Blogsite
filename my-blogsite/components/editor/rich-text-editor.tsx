"use client";

import { useRef } from "react";

function run(command: string, value?: string) {
	document.execCommand(command, false, value);
}

export function RichTextEditor({
	initialHtml = "",
	onChange,
}: {
	initialHtml?: string;
	onChange: (html: string) => void;
}) {
	const editorRef = useRef<HTMLDivElement>(null);
	const toolbar = [
		{ label: "B", title: "Bold", command: "bold", className: "font-bold" },
		{ label: "I", title: "Italic", command: "italic", className: "italic" },
		{ label: "H2", title: "Heading 2", command: "formatBlock", value: "h2" },
		{ label: "H3", title: "Heading 3", command: "formatBlock", value: "h3" },
		{ label: "❝", title: "Quote", command: "formatBlock", value: "blockquote" },
		{ label: "• List", title: "Bullet list", command: "insertUnorderedList" },
		{ label: "1. List", title: "Numbered list", command: "insertOrderedList" },
	];

	return (
		<div className="overflow-hidden rounded-3xl border bg-surface shadow-sm">
			<div className="flex flex-wrap items-center gap-1 border-b bg-surface-muted p-2">
				{toolbar.map((item) => (
					<button
						key={item.title}
						type="button"
						title={item.title}
						onMouseDown={(event) => {
							event.preventDefault();
							run(item.command, item.value);
							editorRef.current?.focus();
						}}
						className={`rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-surface hover:text-accent ${item.className ?? ""}`}
					>
						{item.label}
					</button>
				))}
				<button
					type="button"
					onMouseDown={(event) => {
						event.preventDefault();
						const href = window.prompt("Paste a complete link");
						if (href) run("createLink", href);
					}}
					className="rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-surface hover:text-accent"
				>
					Link
				</button>
				<button
					type="button"
					onMouseDown={(event) => {
						event.preventDefault();
						run("undo");
					}}
					className="rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-surface hover:text-accent"
				>
					Undo
				</button>
				<button
					type="button"
					onMouseDown={(event) => {
						event.preventDefault();
						run("redo");
					}}
					className="rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-surface hover:text-accent"
				>
					Redo
				</button>
			</div>
			<div
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				dangerouslySetInnerHTML={{ __html: initialHtml }}
				onInput={(event) => onChange(event.currentTarget.innerHTML)}
				data-placeholder="Tell your story..."
				className="min-h-[520px] px-6 py-8 text-[17px] leading-8 outline-none empty:before:pointer-events-none empty:before:text-muted empty:before:content-[attr(data-placeholder)] [&_a]:text-accent [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
			/>
		</div>
	);
}
