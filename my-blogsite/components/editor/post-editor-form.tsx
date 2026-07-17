"use client";

import {
	AlertCircle,
	CheckCircle2,
	Eye,
	FileImage,
	FolderOpen,
	Hash,
	ImageUp,
	RotateCcw,
	Sparkles,
	Trash2,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import {
	type ChangeEvent,
	type FormEvent,
	startTransition,
	useActionState,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import type { PostActionState } from "@/app/actions/posts";
import {
	RichTextEditor,
	type RichTextEditorValue,
} from "@/components/editor/rich-text-editor";
import { FieldError } from "@/components/ui/field-error";

export type EditorPost = {
	title: string;
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

type PostEditorFormProps = {
	action: EditorAction;
	categories: Array<{
		id: string;
		name: string;
	}>;
	initialPost?: EditorPost;
};

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
}: PostEditorFormProps) {
	const [state, formAction, pending] = useActionState(
		action,
		initialActionState,
	);

	const [title, setTitle] = useState(
		initialPost?.title ?? "",
	);

	const [body, setBody] = useState(
		initialPost?.body ?? "<p></p>",
	);

	const [bodyText, setBodyText] = useState(
		stripHtml(initialPost?.body ?? ""),
	);

	const [excerpt, setExcerpt] = useState(
		initialPost?.excerpt ?? "",
	);

	const [categoryId, setCategoryId] = useState(
		initialPost?.categoryId ?? "",
	);

	const [tags, setTags] = useState(
		initialPost?.tags.join(", ") ?? "",
	);

	const [selectedImageName, setSelectedImageName] =
		useState("");

	const [selectedImagePreview, setSelectedImagePreview] =
		useState<string | null>(null);

	const [removeCoverImage, setRemoveCoverImage] =
		useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const coverObjectUrlRef = useRef<string | null>(null);

	const currentCoverImage =
		initialPost?.coverImageUrl || null;

	const hasSavedCover =
		Boolean(currentCoverImage) &&
		currentCoverImage !== fallbackCover;

	const wordCount = useMemo(() => {
		return bodyText
			.trim()
			.split(/\s+/)
			.filter(Boolean).length;
	}, [bodyText]);

	const readingMinutes = Math.max(
		1,
		Math.ceil(wordCount / 220),
	);

	const coverPreview = removeCoverImage
		? fallbackCover
		: selectedImagePreview ||
			currentCoverImage ||
			fallbackCover;

	const hasDisplayedCover =
		!removeCoverImage &&
		Boolean(selectedImagePreview || hasSavedCover);

	function handleEditorChange(
		value: RichTextEditorValue,
	) {
		setBody(value.html);
		setBodyText(value.text);
	}

	function clearCoverObjectUrl() {
		if (!coverObjectUrlRef.current) {
			return;
		}

		URL.revokeObjectURL(
			coverObjectUrlRef.current,
		);

		coverObjectUrlRef.current = null;
	}

	function clearSelectedImage() {
		clearCoverObjectUrl();

		setSelectedImageName("");
		setSelectedImagePreview(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleImageChange(
		event: ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];

		clearCoverObjectUrl();

		if (!file) {
			setSelectedImageName("");
			setSelectedImagePreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(file);

		coverObjectUrlRef.current = objectUrl;

		setSelectedImageName(file.name);
		setSelectedImagePreview(objectUrl);
		setRemoveCoverImage(false);
	}

	function handleClearSelectedImage() {
		clearSelectedImage();
		setRemoveCoverImage(false);
	}

	function handleRemoveCoverImage() {
		clearSelectedImage();
		setRemoveCoverImage(true);
	}

	function handleUndoRemoveCoverImage() {
		setRemoveCoverImage(false);
	}

	function handleSubmit(
		event: FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		const form = event.currentTarget;

		if (!form.reportValidity()) {
			return;
		}

		const formData = new FormData(form);

		const nativeEvent =
			event.nativeEvent as SubmitEvent;

		const submitter = nativeEvent.submitter;

		if (
			submitter instanceof HTMLButtonElement &&
			submitter.name
		) {
			formData.set(
				submitter.name,
				submitter.value,
			);
		}

		startTransition(() => {
			formAction(formData);
		});
	}

	useEffect(() => {
		return () => {
			if (coverObjectUrlRef.current) {
				URL.revokeObjectURL(
					coverObjectUrlRef.current,
				);
			}
		};
	}, []);

	return (
		<form
			onSubmit={handleSubmit}
			className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"
		>
			<input
				type="hidden"
				name="body"
				value={body}
			/>

			<input
				type="hidden"
				name="removeCoverImage"
				value={
					removeCoverImage ? "true" : "false"
				}
			/>

			<motion.section
				initial={{
					opacity: 0,
					y: 16,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				transition={{
					duration: 0.45,
					delay: 0.05,
				}}
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
									The URL is generated automatically from
									the title.
								</p>
							</div>

							<Sparkles className="size-5 text-accent" />
						</div>

						<label
							htmlFor="title"
							className="sr-only"
						>
							Story title
						</label>

						<textarea
							id="title"
							name="title"
							value={title}
							onChange={(event) =>
								setTitle(event.target.value)
							}
							rows={2}
							maxLength={140}
							required
							placeholder="A title readers cannot ignore"
							className="w-full resize-none bg-transparent text-3xl font-semibold leading-tight tracking-[-0.03em] outline-none placeholder:text-muted/55 sm:text-5xl"
						/>

						<div className="mt-2 flex items-center justify-between text-xs text-muted">
							<span>
								Make it specific, clear, and
								memorable.
							</span>

							<span>{title.length}/140</span>
						</div>

						<FieldError
							errors={
								state.fieldErrors?.title
							}
						/>

						<div className="mt-7">
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
								value={categoryId}
								onChange={(event) =>
									setCategoryId(
										event.target.value,
									)
								}
								required
								className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
							>
								<option
									value=""
									disabled
								>
									Select category
								</option>

								{categories.map(
									(category) => (
										<option
											key={
												category.id
											}
											value={
												category.id
											}
										>
											{
												category.name
											}
										</option>
									),
								)}
							</select>

							<FieldError
								errors={
									state.fieldErrors
										?.categoryId
								}
							/>
						</div>
					</div>
				</div>

				<div>
					<RichTextEditor
						initialHtml={
							initialPost?.body ??
							"<p></p>"
						}
						onChange={
							handleEditorChange
						}
					/>

					<FieldError
						errors={
							state.fieldErrors?.body
						}
					/>
				</div>
			</motion.section>

			<motion.aside
				initial={{
					opacity: 0,
					x: 16,
				}}
				animate={{
					opacity: 1,
					x: 0,
				}}
				transition={{
					duration: 0.45,
					delay: 0.1,
				}}
				className="space-y-5 xl:sticky xl:top-24 xl:h-fit"
			>
				<div className="overflow-hidden rounded-4xl border border-border bg-surface shadow-sm">
					<div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
						<Image
							src={coverPreview}
							alt={
								hasDisplayedCover
									? "Story cover preview"
									: "Placeholder story cover"
							}
							fill
							sizes="(min-width: 1280px) 352px, 100vw"
							className="object-cover transition duration-500 hover:scale-[1.02]"
							unoptimized={
								coverPreview.startsWith(
									"blob:",
								) ||
								!coverPreview.startsWith(
									"/",
								) ||
								coverPreview.endsWith(
									".svg",
								)
							}
						/>

						{!hasDisplayedCover ? (
							<div className="absolute inset-0 grid place-items-center bg-black/10">
								<div className="rounded-full border border-white/25 bg-black/35 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
									{removeCoverImage
										? "Cover will be removed"
										: "No cover selected"}
								</div>
							</div>
						) : null}

						<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-5 pb-4 pt-12 text-white">
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
								Cover preview
							</p>

							<p className="mt-1 line-clamp-1 font-medium">
								{title ||
									"Untitled story"}
							</p>
						</div>
					</div>

					<div className="p-5">
						<label
							htmlFor="coverImage"
							className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
						>
							<ImageUp className="size-3.5" />

							{initialPost
								? "Replace cover image"
								: "Upload cover image"}
						</label>

						<input
							ref={fileInputRef}
							id="coverImage"
							name="coverImage"
							type="file"
							accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
							required={!initialPost}
							onChange={
								handleImageChange
							}
							className="block w-full rounded-2xl border border-border bg-background text-sm file:mr-3 file:border-0 file:border-r file:border-border file:bg-surface-muted file:px-4 file:py-3 file:text-sm file:font-semibold hover:file:bg-accent-soft"
						/>

						<div className="mt-3 flex flex-wrap gap-2">
							{selectedImageName ? (
								<button
									type="button"
									onClick={
										handleClearSelectedImage
									}
									className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold transition hover:border-accent hover:bg-accent-soft"
								>
									<X className="size-3.5" />
									Clear selected image
								</button>
							) : null}

							{removeCoverImage ? (
								<button
									type="button"
									onClick={
										handleUndoRemoveCoverImage
									}
									className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold transition hover:border-accent hover:bg-accent-soft"
								>
									<RotateCcw className="size-3.5" />
									Undo removal
								</button>
							) : initialPost &&
							  hasSavedCover &&
							  !selectedImageName ? (
								<button
									type="button"
									onClick={
										handleRemoveCoverImage
									}
									className="inline-flex items-center gap-1.5 rounded-full border border-fail px-3 py-2 text-xs font-semibold text-fail-txt transition hover:bg-fail"
								>
									<Trash2 className="size-3.5" />
									Remove cover image
								</button>
							) : null}
						</div>

						<p className="mt-3 text-xs leading-5 text-muted">
							{removeCoverImage
								? "The current cover will be removed when you save this post."
								: selectedImageName
									? `Selected: ${selectedImageName}`
									: initialPost &&
										  hasSavedCover
										? "Leave empty to keep the current cover. Maximum 4 MB."
										: initialPost
											? "No custom cover is currently saved. You may upload one."
											: "A cover image is required. Maximum 4 MB."}
						</p>

						<FieldError
							errors={
								state.fieldErrors
									?.coverImage
							}
						/>
					</div>
				</div>

				<div className="rounded-4xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
								Discovery
							</p>

							<h2 className="mt-1 font-semibold">
								Story details
							</h2>
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
								onChange={(event) =>
									setExcerpt(
										event.target
											.value,
									)
								}
								rows={5}
								maxLength={320}
								placeholder="Write a concise preview for cards, search, and social sharing."
								className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-accent"
							/>

							<div className="mt-1 text-right text-xs text-muted">
								{excerpt.length}
								/320
							</div>

							<FieldError
								errors={
									state.fieldErrors
										?.excerpt
								}
							/>
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
								value={tags}
								onChange={(event) =>
									setTags(
										event.target
											.value,
									)
								}
								placeholder="design, culture, ideas"
								className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
							/>

							<p className="mt-2 text-xs text-muted">
								Separate tags using
								commas. A maximum of eight
								is stored.
							</p>

							<FieldError
								errors={
									state.fieldErrors?.tags
								}
							/>
						</div>
					</div>
				</div>

				<div className="rounded-4xl border border-border bg-surface p-5 shadow-sm">
					<div className="flex items-start gap-3">
						<div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
							<FileImage className="size-4" />
						</div>

						<div>
							<p className="font-semibold">
								Ready to share?
							</p>

							<p className="mt-1 text-xs leading-5 text-muted">
								Review your content
								before publishing or save
								it as a draft.
							</p>
						</div>
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
								{state.success ? (
									<CheckCircle2 className="mt-0.5 size-4 shrink-0" />
								) : (
									<AlertCircle className="mt-0.5 size-4 shrink-0" />
								)}

								<p>
									{state.message}
								</p>
							</div>
						</div>
					) : null}

					<div className="mt-5 grid gap-2.5">
						<button
							type="submit"
							name="intent"
							value="published"
							disabled={pending}
							className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{pending
								? "Publishing story..."
								: "Publish story"}
						</button>

						<button
							type="submit"
							name="intent"
							value="draft"
							disabled={pending}
							className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
						>
							{pending
								? "Saving..."
								: "Save as draft"}
						</button>
					</div>

					<div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
						<span>
							{wordCount} words
						</span>

						<span>
							{readingMinutes} min read
						</span>
					</div>
				</div>
			</motion.aside>
		</form>
	);
}