"use client";

import { useActionState } from "react";

import { type LoginState, login } from "@/app/actions/auth";
import { FieldError } from "@/components/ui/field-error";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

const initialState: LoginState = {};

export function LoginForm() {
	const [state, formAction] = useActionState(login, initialState);
	return (
		<form action={formAction} className="space-y-5">
			<div>
				<label htmlFor="email" className="text-sm font-medium">
					Email address
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.email} />
			</div>
			<div>
				<label htmlFor="password" className="text-sm font-medium">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					placeholder="At least 8 characters"
					className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 text-sm"
				/>
				<FieldError errors={state.fieldErrors?.password} />
			</div>
			{state.message ? (
				<p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
					{state.message}
				</p>
			) : null}
			<FormSubmitButton pendingLabel="Signing in..." className="w-full">
				Sign in
			</FormSubmitButton>
		</form>
	);
}
