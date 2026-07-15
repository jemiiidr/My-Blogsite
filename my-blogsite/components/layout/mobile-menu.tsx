"use client";

import {
	BookOpen,
	Home,
	LayoutDashboard,
	LogIn,
	LogOut,
	PenLine,
	UserRound,
	UsersRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useFormStatus } from "react-dom";

import { logout } from "@/app/actions/auth";
import { MenuIcon, XIcon } from "@/components/ui/icons";

type MobileUser = {
	name: string;
	slug: string; 
	role: "admin" | "author" | "user";
} | null;

type MobileLink = {
	href: string;
	label: string;
	description: string;
	icon: typeof Home;
};

const navigationVariants = {
	hidden: {},
	visible: {
		transition: {
			delayChildren: 0.08,
			staggerChildren: 0.06,
		},
	},
};

const linkVariants = {
	hidden: {
		opacity: 0,
		x: -16,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

function SignOutButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="flex min-h-14 w-full items-center gap-4 rounded-2xl border border-fail-txt bg-fail px-4 py-3 text-left text-sm font-semibold text-fail-txt transition hover:border-fail-txt hover:bg-fail-txt disabled:cursor-not-allowed disabled:opacity-60"
		>
			<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-fail-txt text-fail">
				<LogOut className="size-4" />
			</span>

			<span>{pending ? "Signing out..." : "Sign out"}</span>
		</button>
	);
}

export function MobileMenu({ user }: { user: MobileUser }) {
	const pathname = usePathname();
	const menuId = useId();
	const [open, setOpen] = useState(false);

	const canWrite = user?.role === "admin" || user?.role === "author";

	const links: MobileLink[] = [
		{
			href: "/",
			label: "Home",
			description: "Discover featured stories",
			icon: Home,
		},
		{
			href: "/blog",
			label: "Blog",
			description: "Browse all published articles",
			icon: BookOpen,
		},
		{
			href: "/authors",
			label: "Authors",
			description: "Meet the writers behind LUCID",
			icon: UsersRound,
		},
		...(canWrite
			? [
					{
						href: "/dashboard",
						label: "Dashboard",
						description: "Manage content and analytics",
						icon: LayoutDashboard,
					},
					{
						href: "/dashboard/posts/new",
						label: "Write",
						description: "Create and publish a new story",
						icon: PenLine,
					},
				]
			: []),
			...(user
			? [
					{
						href: `/authors/${user.slug}`,
						label: "Profile",
						description: "View your public author profile",
						icon: UserRound,
					},
				]
			: [
					{
						href: "/login",
						label: "Log in",
						description: "Access your LUCID account",
						icon: LogIn,
					},
				]),
	];

	useEffect(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setOpen(false);
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	function isActiveLink(href: string) {
		if (href === "/") {
			return pathname === "/";
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function getInitials(name: string) {
		return name
			.split(" ")
			.filter(Boolean)
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}

	return (
		<div className="md:hidden">
			<motion.button
				type="button"
				aria-label="Open navigation menu"
				aria-expanded={open}
				aria-controls={menuId}
				onClick={() => setOpen(true)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.93 }}
				className="grid size-10 place-items-center rounded-full border border-border bg-surface shadow-sm transition hover:border-accent"
			>
				<MenuIcon className="size-5" />
			</motion.button>

			<AnimatePresence>
				{open ? (
					<motion.div
						id={menuId}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50"
					>
						<motion.button
							type="button"
							aria-label="Close navigation menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setOpen(false)}
							className="absolute inset-0 bg-background/70 backdrop-blur-md"
						/>

						<motion.aside
							role="dialog"
							aria-modal="true"
							aria-label="Mobile navigation"
							initial={{
								opacity: 0,
								x: "100%",
							}}
							animate={{
								opacity: 1,
								x: 0,
							}}
							exit={{
								opacity: 0,
								x: "100%",
							}}
							transition={{
								type: "spring",
								stiffness: 320,
								damping: 34,
							}}
							className="absolute min-h-screen inset-y-0 right-0 flex w-full max-w-md flex-col overflow-hidden border-l border-border bg-background shadow-2xl"
						>
							<div
								className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl"
							/>

							<div
								className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-accent-soft blur-3xl"
							/>

							<header className="relative flex items-center justify-between border-b border-border px-5 py-5">
								<Link href="/" onClick={() => setOpen(false)}>
									<p className="text-lg font-black tracking-[0.22em]">LUCID</p>

									<p className="mt-0.5 text-xs text-muted">
										Stories worth remembering
									</p>
								</Link>

								<motion.button
									type="button"
									aria-label="Close navigation menu"
									onClick={() => setOpen(false)}
									whileHover={{ rotate: 90 }}
									whileTap={{ scale: 0.9 }}
									className="grid size-11 place-items-center rounded-full border border-border bg-surface shadow-sm transition hover:border-accent"
								>
									<XIcon className="size-5" />
								</motion.button>
							</header>

							{user ? (
								<div className="relative px-5 pt-5">
									<div className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 shadow-sm">
										<div className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20">
											{getInitials(user.name)}
										</div>

										<div className="min-w-0">
											<p className="truncate font-semibold">{user.name}</p>

											<p className="mt-0.5 text-xs capitalize text-muted">
												{user.role} account
											</p>
										</div>

										<span className="ml-auto size-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.65)]" />
									</div>
								</div>
							) : null}

							<motion.nav
								variants={navigationVariants}
								initial="hidden"
								animate="visible"
								aria-label="Mobile navigation links"
								className="relative flex-1 overflow-y-auto px-4 py-5"
							>
								<p className="mb-3 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
									Navigation
								</p>

								<div className="space-y-1.5">
									{links.map((link) => {
										const active = isActiveLink(link.href);
										const Icon = link.icon;

										return (
											<motion.div key={link.href} variants={linkVariants}>
												<Link
													href={link.href}
													onClick={() => setOpen(false)}
													aria-current={active ? "page" : undefined}
													className={[
														"group relative flex items-center gap-4 overflow-hidden rounded-3xl border px-4 py-4 transition",
														active
															? "border-accent/30 bg-accent-soft text-foreground"
															: "border-transparent hover:border-border hover:bg-surface-muted",
													].join(" ")}
												>
													<span
														className={[
															"grid size-11 shrink-0 place-items-center rounded-2xl transition",
															active
																? "bg-accent text-white shadow-sm"
																: "bg-surface text-muted group-hover:text-accent",
														].join(" ")}
													>
														<Icon className="size-4.5" />
													</span>

													<span className="min-w-0 flex-1">
														<span className="block font-semibold">
															{link.label}
														</span>

														<span className="mt-1 block truncate text-xs text-muted">
															{link.description}
														</span>
													</span>

													<span
														aria-hidden="true"
														className="translate-x-2 text-lg opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
													>
														→
													</span>

													{active ? (
														<motion.span
															layoutId="mobile-active-link"
															className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-accent"
														/>
													) : null}
												</Link>
											</motion.div>
										);
									})}
								</div>
							</motion.nav>

							<footer className="relative border-t border-border bg-background/90 px-5 py-5 backdrop-blur">
								{user ? (
									<form action={logout} onSubmit={() => setOpen(false)}>
										<SignOutButton />
									</form>
								) : (
									<Link
										href="/login"
										onClick={() => setOpen(false)}
										className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-85"
									>
										<LogIn className="size-4" />
										Log in
									</Link>
								)}

								<p className="mt-4 text-center text-xs text-muted">
									Read. Write. Inspire.
								</p>
							</footer>
						</motion.aside>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
