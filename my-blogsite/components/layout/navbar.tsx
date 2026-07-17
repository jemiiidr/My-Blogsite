import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavbarProfileMenu } from "@/components/layout/navbar-profile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PenIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth/dal";

export async function Navbar() {
	const user = await getCurrentUser();
	const canWrite = user?.role === "admin" || user?.role === "author";

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo />

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-7 text-sm font-medium md:flex"
				>
					<Link href="/" className="transition hover:text-accent">
						Home
					</Link>
					<Link href="/blog" className="transition hover:text-accent">
						Blog
					</Link>
					<Link href="/authors" className="transition hover:text-accent">
						Authors
					</Link>
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />

					{canWrite ? (
						<Link
							href="/dashboard/posts/new"
							className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90 lg:flex"
						>
							<PenIcon className="size-4" />
							Write
						</Link>
					) : null}

					{user ? (
						<div className="hidden md:block">
							<NavbarProfileMenu
								user={{
									name: user.name,
									slug: user.slug,
									role: user.role,
									avatarUrl: user.avatarUrl,
								}}
							/>
						</div>
					) : (
						<div className="hidden items-center gap-2 md:flex">
							<Link
								href="/login"
								className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
							>
								Log in
							</Link>
							<Link
								href="/signup"
								className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-85"
							>
								Sign up
							</Link>
						</div>
					)}

					<MobileMenu
						user={
							user
								? {
										name: user.name,
										slug: user.slug,
										role: user.role,
									}
								: null
						}
					/>
				</div>
			</div>
		</header>
	);
}
