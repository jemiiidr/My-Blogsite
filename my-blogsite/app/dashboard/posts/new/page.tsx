import { createPost } from "@/app/actions/posts";
import { PostEditorForm } from "@/components/editor/post-editor-form";
import { requireAuthor } from "@/lib/auth/permissions";
import { getCategories } from "@/lib/db/queries/categories";

export const metadata = { title: "Write a story" };

export default async function NewPostPage() {
	await requireAuthor();
	const categories = await getCategories();
	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Editor
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight">
					Create a new story
				</h1>
				<p className="mt-2 text-muted">
					Write with focus, then refine the publishing details.
				</p>
			</div>
			<PostEditorForm action={createPost} categories={categories} />
		</div>
	);
}
