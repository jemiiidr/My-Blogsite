"use client";

import { useActionState } from "react";

import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState: ProfileState = { success: false };

export function ProfileForm({ user }: { user: { name: string; bio: string; avatarUrl: string | null } }) {
	const [state, formAction] = useActionState(updateProfile, initialState);
	return (
		<form action={formAction} className="space-y-5 rounded-[1.75rem] border bg-surface p-6 sm:p-8">
			<div>
				<label htmlFor="profileName" className="text-sm font-medium">Display name</label>
				<input id="profileName" name="name" defaultValue={user.name} className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm" />
				<FieldError errors={state.fieldErrors?.name} />
			</div>
			<div>
				<label htmlFor="avatarUrl" className="text-sm font-medium">Profile picture URL</label>
				<input id="avatarUrl" name="avatarUrl" defaultValue={user.avatarUrl ?? ""} placeholder="/images/avatars/your-photo.jpg or https://..." className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm" />
				<FieldError errors={state.fieldErrors?.avatarUrl} />
			</div>
			<div>
				<label htmlFor="bio" className="text-sm font-medium">Bio</label>
				<textarea id="bio" name="bio" defaultValue={user.bio} rows={6} className="mt-2 w-full rounded-2xl border bg-background px-4 py-3 text-sm leading-6" />
				<FieldError errors={state.fieldErrors?.bio} />
			</div>
			<div className="flex items-center justify-between gap-4">
				<p className={`text-sm ${state.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{state.message}</p>
				<FormSubmitButton>Save profile</FormSubmitButton>
			</div>
		</form>
	);
}
