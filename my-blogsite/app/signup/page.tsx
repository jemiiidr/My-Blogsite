import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage() {
	const user = await getCurrentUser();
	if (user) redirect(user.role === "user" ? "/profile" : "/dashboard");

	return (
		<div className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
			<div className="hidden min-h-140 rounded-[2.5rem] border bg-[radial-gradient(circle_at_20%_20%,rgba(168,137,255,0.5),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(92,225,230,0.4),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(255,145,190,0.45),transparent_40%)] p-10 lg:flex lg:flex-col lg:justify-end">
				<p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
					Create a reader account and become part of the conversation.
				</p>
				<p className="mt-5 max-w-md text-sm leading-7 text-muted">
					Every public registration is created with the reader role. Reader
					accounts can like stories, comment, and manage their profile.
				</p>
			</div>

			<div className="mx-auto w-full max-w-md rounded-4xl border bg-surface p-7 shadow-xl sm:p-10">
				<Logo />
				<h1 className="mt-9 text-4xl font-semibold tracking-tight">
					Create your account
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted">
					Already registered?{" "}
					<Link href="/login" className="font-semibold text-accent">
						Log in
					</Link>
				</p>
				<div className="mt-8">
					<SignupForm />
				</div>
			</div>
		</div>
	);
}
