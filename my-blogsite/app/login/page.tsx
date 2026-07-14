import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
	const user = await getCurrentUser();
	if (user) redirect(user.role === "user" ? "/profile" : "/dashboard");

	return (
		<div className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
			<div className="hidden min-h-[560px] rounded-[2.5rem] border bg-[radial-gradient(circle_at_20%_20%,rgba(168,137,255,0.5),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(92,225,230,0.4),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(255,145,190,0.45),transparent_40%)] p-10 lg:flex lg:flex-col lg:justify-end">
				<p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
					Stories become more meaningful when you can join the conversation.
				</p>
				<p className="mt-5 max-w-md text-sm leading-7 text-muted">
					Registered users can like stories and personalize their profile.
					Authors and administrators receive access to the writing dashboard.
				</p>
			</div>
			<div className="mx-auto w-full max-w-md rounded-[2rem] border bg-surface p-7 shadow-xl sm:p-10">
				<Logo />
				<h1 className="mt-9 text-4xl font-semibold tracking-tight">
					Welcome back
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted">
					Use one of the seeded accounts listed in the README, or an account
					created by the administrator.
				</p>
				<div className="mt-8">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
