"use client";

import { useActionState } from "react";

import { type SignupState, signup } from "@/app/actions/auth";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState: SignupState = {};

export function SignupForm() {
	const [state, formAction] = useActionState(signup, initialState);

	return (
		<form action={formAction} className="space-y-5">
			<div>
				<label htmlFor="name" className="text-sm font-medium">
					Display name
				</label>
				<input
					id="name"
					name="name"
					type="text"
					autoComplete="name"
					placeholder="Your name"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.name} />
			</div>

			<div>
				<label htmlFor="signupEmail" className="text-sm font-medium">
					Email address
				</label>
				<input
					id="signupEmail"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.email} />
			</div>

			<div>
				<label htmlFor="signupPassword" className="text-sm font-medium">
					Password
				</label>
				<input
					id="signupPassword"
					name="password"
					type="password"
					autoComplete="new-password"
					placeholder="At least 8 characters"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.password} />
			</div>

			<div>
				<label htmlFor="confirmPassword" className="text-sm font-medium">
					Confirm password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					autoComplete="new-password"
					placeholder="Enter the same password"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.confirmPassword} />
			</div>

			{state.message ? (
				<p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
					{state.message}
				</p>
			) : null}

			<FormSubmitButton pendingLabel="Creating account..." className="w-full">
				Create reader account
			</FormSubmitButton>
		</form>
	);
}
