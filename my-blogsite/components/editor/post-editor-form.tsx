"use client";

import {
	CheckCircle2,
	Eye,
	FileImage,
	FolderOpen,
	Hash,
	KeyRound,
	Link2,
	Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useActionState, useMemo, useState } from "react";

import type { PostActionState } from "@/app/actions/posts";
import {
	RichTextEditor,
	type RichTextEditorValue,
} from "@/components/editor/rich-text-editor";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { slugify } from "@/lib/utils/slugify";

export type EditorPost = {
	title: string;
	slug: string;
	excerpt: string;
	body: string;
	coverImageUrl: string;
	categoryId: string | null;
	tags: string[];
	status: "draft" | "published" | "archived";
};

type EditorAction = (
	state: PostActionState,
	formData: FormData,
) => Promise<PostActionState>;

const initialActionState: PostActionState = {
	success: false,
};

const fallbackCover = "/images/posts/story-gradient.svg";

function stripHtml(html: string) {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/\s+/g, " ")
		.trim();
}

export function PostEditorForm({
	action,
	categories,
	initialPost,
}: {
	action: EditorAction;
	categories: Array<{
		id: string;
		name: string;
	}>;
	initialPost?: EditorPost;
}) {
	const [state, formAction] = useActionState(action, initialActionState);

	const [title, setTitle] = useState(initialPost?.title ?? "");
	const [slug, setSlug] = useState(initialPost?.slug ?? "");
	const [slugEdited, setSlugEdited] = useState(Boolean(initialPost?.slug));

	const [body, setBody] = useState(initialPost?.body ?? "<p></p>");
	const [bodyText, setBodyText] = useState(stripHtml(initialPost?.body ?? ""));

	const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
	const [cover, setCover] = useState(
		initialPost?.coverImageUrl ?? fallbackCover,
	);

	const wordCount = useMemo(() => {
		return bodyText.trim().split(/\s+/).filter(Boolean).length;
	}, [bodyText]);

	const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
	const coverPreview = cover.trim() || fallbackCover;
	const canPreviewWithNextImage = coverPreview.startsWith("/");

	function handleTitleChange(value: string) {
		setTitle(value);

		if (!slugEdited) {
			setSlug(slugify(value));
		}
	}

	function handleSlugChange(value: string) {
		setSlugEdited(true);
		setSlug(value);
	}

	function handleEditorChange(value: RichTextEditorValue) {
		setBody(value.html);
		setBodyText(value.text);
	}

	return (
		<form
			action={formAction}
			noValidate
			className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
		>
			<input type="hidden" name="body" value={body} />

			<motion.section
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, delay: 0.05 }}
				className="min-w-0 space-y-6"
			>
				<div className="relative overflow-hidden rounded-4xl border border-border bg-surface p-5 shadow-sm sm:p-7">
					<div className="pointer-events-none absolute -left-16 -top-20 size-52 rounded-full bg-accent/8 blur-3xl" />

					<div className="relative">
						<div className="mb-5 flex items-center justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
									Story identity
								</p>
								<p className="mt-1 text-sm text-muted">
									Give readers a clear reason to continue.
								</p>
							</div>

							<Sparkles className="size-5 text-accent" />
						</div>

						<label htmlFor="title" className="sr-only">
							Story title
						</label>

						<textarea
							id="title"
							name="title"
							value={title}
							onChange={(event) => handleTitleChange(event.target.value)}
							rows={2}
							maxLength={140}
							placeholder="A title readers cannot ignore"
							className="w-full resize-none bg-transparent text-3xl font-semibold leading-tight tracking-[-0.03em] outline-none placeholder:text-muted/55 sm:text-5xl"
						/>

						<div className="mt-2 flex items-center justify-between text-xs text-muted">
							<span>Make it specific, clear, and memorable.</span>
							<span>{title.length}/140</span>
						</div>

						<FieldError errors={state.fieldErrors?.title} />

						<div className="mt-7 grid gap-4 sm:grid-cols-2">
							<div>
								<label
									htmlFor="slug"
									className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
								>
									<Link2 className="size-3.5" />
									URL slug
								</label>

								<div className="flex items-center overflow-hidden rounded-2xl border border-border bg-background focus-within:border-accent">
									<span className="border-r border-border px-3 py-3 text-sm text-muted">
										/blog/
									</span>

									<input
										id="slug"
										name="slug"
										value={slug}
										onChange={(event) => handleSlugChange(event.target.value)}
										placeholder="generated-from-title"
										className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
									/>
								</div>

								<FieldError errors={state.fieldErrors?.slug} />
							</div>

							<div>
								<label
									htmlFor="categoryId"
									className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
								>
									<FolderOpen className="size-3.5" />
									Category
								</label>

								<select
									id="categoryId"
									name="categoryId"
									defaultValue={initialPost?.categoryId ?? ""}
									className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
								>
									<option value="">Select category</option>

									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>

								<FieldError errors={state.fieldErrors?.categoryId} />
							</div>
						</div>
					</div>
				</div>

				<div>
					<RichTextEditor
						initialHtml={initialPost?.body ?? "<p></p>"}
						onChange={handleEditorChange}
					/>

					<FieldError errors={state.fieldErrors?.body} />
				</div>
			</motion.section>

			<motion.aside
				initial={{ opacity: 0, x: 16 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.45, delay: 0.1 }}
				className="space-y-5 xl:sticky xl:top-24 xl:h-fit"
			>
				<div className="overflow-hidden rounded-4xl border border-border bg-surface shadow-sm">
					<div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
						{canPreviewWithNextImage ? (
							<Image
								src={coverPreview}
								alt="Story cover preview"
								fill
								sizes="(min-width: 1280px) 352px, 100vw"
								className="object-cover transition duration-500 hover:scale-[1.02]"
								unoptimized={coverPreview.endsWith(".svg")}
							/>
						) : (
							<div className="absolute inset-0 grid place-items-center bg-linear-to-br from-accent-soft via-surface-muted to-background p-6 text-center">
								<div>
									<FileImage className="mx-auto size-8 text-accent" />

									<p className="mt-3 text-sm font-semibold">
										Remote cover selected
									</p>

									<p className="mt-1 line-clamp-2 break-all text-xs text-muted">
										Add its host to your Next.js image configuration to preview
										it.
									</p>
								</div>
							</div>
						)}

						<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-5 pb-4 pt-12 text-white">
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
								Cover preview
							</p>

							<p className="mt-1 line-clamp-1 font-medium">
								{title || "Untitled story"}
							</p>
						</div>
					</div>

					<div className="p-5">
						<label
							htmlFor="coverImageUrl"
							className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
						>
							<FileImage className="size-3.5" />
							Cover image path or URL
						</label>

						<input
							id="coverImageUrl"
							name="coverImageUrl"
							value={cover}
							onChange={(event) => setCover(event.target.value)}
							placeholder="/images/posts/cover.webp"
							className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
						/>

						<p className="mt-2 text-xs leading-5 text-muted">
							Use a local image path or an approved storage URL.
						</p>

						<FieldError errors={state.fieldErrors?.coverImageUrl} />
					</div>
				</div>

				<div className="rounded-4xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
								Discovery
							</p>
							<h2 className="mt-1 font-semibold">Story details</h2>
						</div>

						<Eye className="size-4.5 text-muted" />
					</div>

					<div className="mt-5 space-y-5">
						<div>
							<label
								htmlFor="excerpt"
								className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
							>
								Excerpt
							</label>

							<textarea
								id="excerpt"
								name="excerpt"
								value={excerpt}
								onChange={(event) => setExcerpt(event.target.value)}
								rows={5}
								maxLength={320}
								placeholder="Write a concise preview for cards, search, and social sharing."
								className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-accent"
							/>

							<div className="mt-1 text-right text-xs text-muted">
								{excerpt.length}/320
							</div>

							<FieldError errors={state.fieldErrors?.excerpt} />
						</div>

						<div>
							<label
								htmlFor="tags"
								className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
							>
								<Hash className="size-3.5" />
								Tags
							</label>

							<input
								id="tags"
								name="tags"
								defaultValue={initialPost?.tags.join(", ")}
								placeholder="design, culture, ideas"
								className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
							/>

							<p className="mt-2 text-xs text-muted">
								Separate tags using commas. A maximum of eight is stored.
							</p>

							<FieldError errors={state.fieldErrors?.tags} />
						</div>
					</div>
				</div>

				<div className="rounded-4xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-start gap-3">
						<div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
							<KeyRound className="size-4" />
						</div>

						<div>
							<h2 className="font-semibold">Publishing</h2>
							<p className="mt-1 text-xs leading-5 text-muted">
								Drafts do not need the publishing key.
							</p>
						</div>
					</div>

					<div className="mt-5">
						<label
							htmlFor="publishPassword"
							className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
						>
							Publishing key
						</label>

						<input
							id="publishPassword"
							name="publishPassword"
							type="password"
							autoComplete="off"
							placeholder="Required when publishing"
							className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
						/>

						<FieldError errors={state.fieldErrors?.publishPassword} />
					</div>

					{state.message ? (
						<div
							role="status"
							className={[
								"mt-4 rounded-2xl border p-4 text-sm",
								state.success
									? "border-success bg-emerald-success text-success-txt"
									: "border-fail bg-fail text-fail-txt",
							].join(" ")}
						>
							<div className="flex items-start gap-2">
								<CheckCircle2 className="mt-0.5 size-4 shrink-0" />
								<p>{state.message}</p>
							</div>
						</div>
					) : null}

					<div className="mt-5 grid gap-2.5">
						<FormSubmitButton
							name="intent"
							value="published"
							pendingLabel="Publishing story..."
							className="w-full"
						>
							Publish story
						</FormSubmitButton>

						<FormSubmitButton
							name="intent"
							value="draft"
							pendingLabel="Saving draft..."
							className="w-full border border-border bg-surface text-foreground hover:border-accent hover:bg-accent-soft"
						>
							Save as draft
						</FormSubmitButton>
					</div>

					<div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
						<span>{wordCount} words</span>
						<span>{readingMinutes} min read</span>
					</div>
				</div>
			</motion.aside>
		</form>
	);
}
