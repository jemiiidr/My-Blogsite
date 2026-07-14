import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Avatar } from "@/components/ui/avatar";
import { LogOutIcon, PenIcon, SearchIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth/dal";

export async function Navbar() {
	const user = await getCurrentUser();
	const canWrite = user?.role === "admin" || user?.role === "author";

	return (
		<header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo />
				<nav className="hidden items-center gap-7 text-sm font-medium md:flex">
					<Link href="/" className="transition hover:text-accent">Home</Link>
					<Link href="/blog" className="transition hover:text-accent">Blog</Link>
					<Link href="/authors" className="transition hover:text-accent">Authors</Link>
					{canWrite ? (
						<Link href="/dashboard" className="transition hover:text-accent">Dashboard</Link>
					) : null}
				</nav>
				<div className="flex items-center gap-2">
					<Link
						href="/blog"
						aria-label="Search stories"
						className="hidden size-10 place-items-center rounded-full border bg-surface transition hover:border-accent hover:text-accent sm:grid"
					>
						<SearchIcon className="size-4" />
					</Link>
					<ThemeToggle />
					{canWrite ? (
						<Link
							href="/dashboard/posts/new"
							className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:-translate-y-0.5 lg:flex"
						>
							<PenIcon className="size-4" /> Write
						</Link>
					) : null}
					{user ? (
						<div className="hidden items-center gap-2 md:flex">
							<Link href="/profile" title={user.name}>
								<Avatar name={user.name} src={user.avatarUrl} size={38} />
							</Link>
							<form action={logout}>
								<button
									type="submit"
									aria-label="Log out"
									className="grid size-10 place-items-center rounded-full border bg-surface text-muted transition hover:border-rose-400 hover:text-rose-500"
								>
									<LogOutIcon className="size-4" />
								</button>
							</form>
						</div>
					) : (
						<Link
							href="/login"
							className="hidden rounded-full border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent md:block"
						>
							Log in
						</Link>
					)}
					<MobileMenu user={user ? { name: user.name, role: user.role } : null} />
				</div>
			</div>
		</header>
	);
}
