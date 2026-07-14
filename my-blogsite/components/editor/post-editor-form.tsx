"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";

import type { PostActionState } from "@/app/actions/posts";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

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

type EditorAction = (state: PostActionState, formData: FormData) => Promise<PostActionState>;

export function PostEditorForm({ action, categories, initialPost }: { action: EditorAction; categories: Array<{ id: string; name: string }>; initialPost?: EditorPost }) {
	const [state, formAction] = useActionState(action, { success: false });
	const [body, setBody] = useState(initialPost?.body ?? "<p></p>");
	const [cover, setCover] = useState(initialPost?.coverImageUrl ?? "/images/posts/story-gradient.svg");
	const [title, setTitle] = useState(initialPost?.title ?? "");
	const wordCount = useMemo(() => body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length, [body]);
	const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

	return (
		<form action={formAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
			<input type="hidden" name="body" value={body} />
			<section className="min-w-0 space-y-5">
				<div className="rounded-3xl border bg-surface p-5 shadow-sm">
					<label htmlFor="title" className="sr-only">Story title</label>
					<textarea id="title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} rows={2} placeholder="A title readers cannot ignore" className="w-full resize-none bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-muted sm:text-5xl" />
					<FieldError errors={state.fieldErrors?.title} />
					<div className="mt-5 grid gap-4 sm:grid-cols-2">
						<div><label htmlFor="slug" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">URL slug</label><input id="slug" name="slug" defaultValue={initialPost?.slug} placeholder="generated-from-title" className="w-full rounded-xl border bg-background px-4 py-3 text-sm" /><FieldError errors={state.fieldErrors?.slug} /></div>
						<div><label htmlFor="categoryId" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Category</label><select id="categoryId" name="categoryId" defaultValue={initialPost?.categoryId ?? ""} className="w-full rounded-xl border bg-background px-4 py-3 text-sm"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><FieldError errors={state.fieldErrors?.categoryId} /></div>
					</div>
				</div>
				<RichTextEditor initialHtml={body} onChange={setBody} />
				<FieldError errors={state.fieldErrors?.body} />
			</section>
			<aside className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
				<div className="overflow-hidden rounded-3xl border bg-surface shadow-sm">
					<div className="relative aspect-[16/10] bg-surface-muted"><Image src={cover || "/images/posts/story-gradient.svg"} alt="Cover preview" fill className="object-cover" /></div>
					<div className="p-4"><label htmlFor="coverImageUrl" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Cover image URL</label><input id="coverImageUrl" name="coverImageUrl" value={cover} onChange={(event) => setCover(event.target.value)} className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm" /><FieldError errors={state.fieldErrors?.coverImageUrl} /></div>
				</div>
				<div className="rounded-3xl border bg-surface p-5 shadow-sm">
					<h2 className="font-semibold">Story details</h2>
					<div className="mt-4 space-y-4">
						<div><label htmlFor="excerpt" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Excerpt</label><textarea id="excerpt" name="excerpt" defaultValue={initialPost?.excerpt} rows={5} placeholder="A concise preview for cards and search." className="w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-sm" /><FieldError errors={state.fieldErrors?.excerpt} /></div>
						<div><label htmlFor="tags" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Tags</label><input id="tags" name="tags" defaultValue={initialPost?.tags.join(", ")} placeholder="design, culture, ideas" className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm" /><FieldError errors={state.fieldErrors?.tags} /></div>
						<div><label htmlFor="publishPassword" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">Publishing key</label><input id="publishPassword" name="publishPassword" type="password" placeholder="Required only to publish" className="w-full rounded-xl border bg-background px-3 py-2.5 text-sm" /><FieldError errors={state.fieldErrors?.publishPassword} /></div>
					</div>
					<div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted"><span>{wordCount} words</span><span>{readingMinutes} min read</span></div>
					{state.message ? <p className={`mt-4 rounded-xl p-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"}`}>{state.message}</p> : null}
					<div className="mt-5 grid gap-2"><FormSubmitButton name="intent" value="published" pendingLabel="Publishing...">Publish story</FormSubmitButton><FormSubmitButton name="intent" value="draft" pendingLabel="Saving draft..." className="border bg-surface text-foreground hover:border-accent">Save draft</FormSubmitButton></div>
				</div>
			</aside>
		</form>
	);
}
