import type { Metadata } from "next";

import { ProfileForm } from "@/components/profile/profile-form";
import { requireUser } from "@/lib/auth/permissions";

export const metadata: Metadata = {
	title: "Your profile",
};

export default async function ProfilePage() {
	const user = await requireUser();

	return (
		<main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
			<header>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
					Account
				</p>

				<h1 className="mt-2 text-4xl font-semibold tracking-tight">
					Your profile
				</h1>

				<p className="mt-3 text-muted">
					Update the name, profile picture, and bio shown with your activity.
				</p>
			</header>

			<div className="mt-8">
				<ProfileForm
					user={{
						name: user.name,
						bio: user.bio,
						avatarUrl: user.avatarUrl,
					}}
				/>
			</div>
		</main>
	);
}
