"use client";

import type { Editor } from "@tiptap/react";
import {
	Bold,
	Code2,
	Eraser,
	Heading2,
	Heading3,
	Italic,
	Link2,
	List,
	ListOrdered,
	Minus,
	Pilcrow,
	Quote,
	Redo2,
	Strikethrough,
	Undo2,
	Unlink,
} from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

type ToolbarButtonProps = {
	label: string;
	children: ReactNode;
	active?: boolean;
	disabled?: boolean;
	onClick: () => void;
};

type ToolbarState = {
	isParagraph: boolean;
	isHeading2: boolean;
	isHeading3: boolean;
	isBold: boolean;
	isItalic: boolean;
	isStrike: boolean;
	isCode: boolean;
	isBlockquote: boolean;
	isBulletList: boolean;
	isOrderedList: boolean;
	isLink: boolean;
};

const initialToolbarState: ToolbarState = {
	isParagraph: false,
	isHeading2: false,
	isHeading3: false,
	isBold: false,
	isItalic: false,
	isStrike: false,
	isCode: false,
	isBlockquote: false,
	isBulletList: false,
	isOrderedList: false,
	isLink: false,
};

function ToolbarButton({
	label,
	children,
	active = false,
	disabled = false,
	onClick,
}: ToolbarButtonProps) {
	return (
		<motion.button
			type="button"
			title={label}
			aria-label={label}
			aria-pressed={active}
			disabled={disabled}
			onClick={onClick}
			whileHover={disabled ? undefined : { y: -1 }}
			whileTap={disabled ? undefined : { scale: 0.94 }}
			className={[
				"grid size-9 shrink-0 place-items-center rounded-xl border text-sm transition",
				"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
				"disabled:cursor-not-allowed disabled:opacity-35",
				active
					? "border-accent bg-accent text-white shadow-sm"
					: "border-transparent text-muted hover:border-border hover:bg-surface hover:text-foreground",
			].join(" ")}
		>
			{children}
		</motion.button>
	);
}

function ToolbarDivider() {
	return (
		<span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-border" />
	);
}

function normalizeLink(value: string) {
	const trimmedValue = value.trim();

	if (
		trimmedValue.startsWith("/") ||
		trimmedValue.startsWith("#") ||
		trimmedValue.startsWith("mailto:") ||
		trimmedValue.startsWith("tel:") ||
		/^https?:\/\//i.test(trimmedValue)
	) {
		return trimmedValue;
	}

	return `https://${trimmedValue}`;
}

function getToolbarState(editor: Editor | null): ToolbarState {
	if (!editor || editor.isDestroyed) {
		return initialToolbarState;
	}

	return {
		isParagraph: editor.isActive("paragraph"),
		isHeading2: editor.isActive("heading", {
			level: 2,
		}),
		isHeading3: editor.isActive("heading", {
			level: 3,
		}),
		isBold: editor.isActive("bold"),
		isItalic: editor.isActive("italic"),
		isStrike: editor.isActive("strike"),
		isCode: editor.isActive("code"),
		isBlockquote: editor.isActive("blockquote"),
		isBulletList: editor.isActive("bulletList"),
		isOrderedList: editor.isActive("orderedList"),
		isLink: editor.isActive("link"),
	};
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
	const [toolbarState, setToolbarState] =
		useState<ToolbarState>(initialToolbarState);

	const editorReady = Boolean(editor && !editor.isDestroyed);

	useEffect(() => {
		if (!editor || editor.isDestroyed) {
			setToolbarState(initialToolbarState);
			return;
		}

		const updateToolbarState = () => {
			setToolbarState(getToolbarState(editor));
		};

		updateToolbarState();

		editor.on("selectionUpdate", updateToolbarState);
		editor.on("transaction", updateToolbarState);
		editor.on("focus", updateToolbarState);
		editor.on("blur", updateToolbarState);

		return () => {
			editor.off("selectionUpdate", updateToolbarState);
			editor.off("transaction", updateToolbarState);
			editor.off("focus", updateToolbarState);
			editor.off("blur", updateToolbarState);
		};
	}, [editor]);

	const runEditorCommand = useCallback(
		(command: (currentEditor: Editor) => void) => {
			if (!editor || editor.isDestroyed) {
				return;
			}

			command(editor);
		},
		[editor],
	);

	const editLink = useCallback(() => {
		if (!editor || editor.isDestroyed) {
			return;
		}

		const currentHref = editor.getAttributes("link").href as string | undefined;

		const enteredHref = window.prompt(
			"Enter a link address",
			currentHref ?? "https://",
		);

		if (enteredHref === null) {
			return;
		}

		if (enteredHref.trim() === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();

			return;
		}

		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({
				href: normalizeLink(enteredHref),
				target: "_blank",
				rel: "noopener noreferrer",
			})
			.run();
	}, [editor]);

	return (
		<div className="border-b border-border bg-surface-muted/75 px-3 py-2.5 backdrop-blur-xl">
			<div
				role="toolbar"
				aria-label="Story formatting controls"
				className="flex items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
			>
				<ToolbarButton
					label="Paragraph"
					active={toolbarState.isParagraph}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().setParagraph().run();
						})
					}
				>
					<Pilcrow className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Heading 2"
					active={toolbarState.isHeading2}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor
								.chain()
								.focus()
								.toggleHeading({
									level: 2,
								})
								.run();
						})
					}
				>
					<Heading2 className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Heading 3"
					active={toolbarState.isHeading3}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor
								.chain()
								.focus()
								.toggleHeading({
									level: 3,
								})
								.run();
						})
					}
				>
					<Heading3 className="size-4" />
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton
					label="Bold"
					active={toolbarState.isBold}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleBold().run();
						})
					}
				>
					<Bold className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Italic"
					active={toolbarState.isItalic}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleItalic().run();
						})
					}
				>
					<Italic className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Strikethrough"
					active={toolbarState.isStrike}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleStrike().run();
						})
					}
				>
					<Strikethrough className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Inline code"
					active={toolbarState.isCode}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleCode().run();
						})
					}
				>
					<Code2 className="size-4" />
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton
					label="Quotation"
					active={toolbarState.isBlockquote}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleBlockquote().run();
						})
					}
				>
					<Quote className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Bullet list"
					active={toolbarState.isBulletList}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleBulletList().run();
						})
					}
				>
					<List className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Numbered list"
					active={toolbarState.isOrderedList}
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().toggleOrderedList().run();
						})
					}
				>
					<ListOrdered className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Horizontal divider"
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().setHorizontalRule().run();
						})
					}
				>
					<Minus className="size-4" />
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton
					label={toolbarState.isLink ? "Edit link" : "Add link"}
					active={toolbarState.isLink}
					disabled={!editorReady}
					onClick={editLink}
				>
					<Link2 className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Remove link"
					disabled={!editorReady || !toolbarState.isLink}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor
								.chain()
								.focus()
								.extendMarkRange("link")
								.unsetLink()
								.run();
						})
					}
				>
					<Unlink className="size-4" />
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton
					label="Clear formatting"
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().unsetAllMarks().clearNodes().run();
						})
					}
				>
					<Eraser className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Undo"
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().undo().run();
						})
					}
				>
					<Undo2 className="size-4" />
				</ToolbarButton>

				<ToolbarButton
					label="Redo"
					disabled={!editorReady}
					onClick={() =>
						runEditorCommand((currentEditor) => {
							currentEditor.chain().focus().redo().run();
						})
					}
				>
					<Redo2 className="size-4" />
				</ToolbarButton>
			</div>
		</div>
	);
}
