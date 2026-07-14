"use client";

import { useActionState } from "react";

import { createAuthor, type AuthorActionState } from "@/app/actions/authors";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

export const initialAuthorState: AuthorActionState = { success: false };

export function CreateAuthorForm() {
	const [state, formAction] = useActionState(createAuthor, initialAuthorState);
	return (
		<form
			action={formAction}
			className="rounded-3xl border bg-surface p-5 shadow-sm"
		>
			<h2 className="text-lg font-semibold">Add an author</h2>
			<p className="mt-1 text-sm text-muted">
				Create a secure account that can write and view analytics.
			</p>
			<div className="mt-5 grid gap-4 sm:grid-cols-2">
				<div>
					<label htmlFor="name" className="mb-2 block text-sm font-medium">
						Full name
					</label>
					<input
						id="name"
						name="name"
						className="w-full rounded-xl border bg-background px-4 py-3"
					/>
					<FieldError errors={state.fieldErrors?.name} />
				</div>
				<div>
					<label htmlFor="email" className="mb-2 block text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						className="w-full rounded-xl border bg-background px-4 py-3"
					/>
					<FieldError errors={state.fieldErrors?.email} />
				</div>
				<div>
					<label htmlFor="password" className="mb-2 block text-sm font-medium">
						Temporary password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						className="w-full rounded-xl border bg-background px-4 py-3"
					/>
					<FieldError errors={state.fieldErrors?.password} />
				</div>
				<div>
					<label htmlFor="avatarUrl" className="mb-2 block text-sm font-medium">
						Profile picture URL
					</label>
					<input
						id="avatarUrl"
						name="avatarUrl"
						placeholder="/images/avatars/..."
						className="w-full rounded-xl border bg-background px-4 py-3"
					/>
					<FieldError errors={state.fieldErrors?.avatarUrl} />
				</div>
			</div>
			<div className="mt-4">
				<label htmlFor="bio" className="mb-2 block text-sm font-medium">
					Bio
				</label>
				<textarea
					id="bio"
					name="bio"
					rows={4}
					className="w-full resize-none rounded-xl border bg-background px-4 py-3"
				/>
				<FieldError errors={state.fieldErrors?.bio} />
			</div>
			{state.message ? (
				<p
					className={`mt-4 rounded-xl p-3 text-sm ${state.success ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"}`}
				>
					{state.message}
				</p>
			) : null}
			<div className="mt-5">
				<FormSubmitButton pendingLabel="Creating author...">
					Create author
				</FormSubmitButton>
			</div>
		</form>
	);
}
