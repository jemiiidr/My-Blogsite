"use client";

import { useFormStatus } from "react-dom";

export function FormSubmitButton({
	children,
	pendingLabel = "Saving...",
	className = "",
	name,
	value,
}: {
	children: React.ReactNode;
	pendingLabel?: string;
	className?: string;
	name?: string;
	value?: string;
}) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			name={name}
			value={value}
			disabled={pending}
			className={`rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
		>
			{pending ? pendingLabel : children}
		</button>
	);
}
