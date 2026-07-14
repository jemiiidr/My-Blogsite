import { notFound } from "next/navigation";

import { updatePost } from "@/app/actions/posts";
import { PostEditorForm } from "@/components/editor/post-editor-form";
import { requireAuthor } from "@/lib/auth/permissions";
import { getCategories } from "@/lib/db/queries/categories";
import { getPostByIdForEditor } from "@/lib/db/queries/posts";

export const metadata = { title: "Edit story" };

export default async function EditPostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const user = await requireAuthor();
	const { id } = await params;
	const [post, categories] = await Promise.all([
		getPostByIdForEditor(id),
		getCategories(),
	]);
	if (!post) notFound();
	if (user.role !== "admin" && post.authorId !== user.id) notFound();
	const action = updatePost.bind(null, post.id);
	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Editor
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight">
					Edit story
				</h1>
				<p className="mt-2 text-muted">
					Changes are validated and saved through a Server Action.
				</p>
			</div>
			<PostEditorForm
				action={action}
				categories={categories}
				initialPost={post}
			/>
		</div>
	);
}
