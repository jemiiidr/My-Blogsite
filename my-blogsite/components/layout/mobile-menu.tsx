"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MenuIcon, XIcon } from "@/components/ui/icons";

type MobileUser = {
	name: string;
	role: "admin" | "author" | "user";
} | null;

type MobileMenuProps = {
	user: MobileUser;
};

const containerVariants = {
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
		y: 18,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.35,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

export function MobileMenu({ user }: MobileMenuProps) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	const canWrite = user?.role === "admin" || user?.role === "author";

	const links = [
		{
			href: "/",
			label: "Home",
			description: "Discover featured stories",
		},
		{
			href: "/blog",
			label: "Blog",
			description: "Browse all published articles",
		},
		{
			href: "/authors",
			label: "Authors",
			description: "Meet the people behind the stories",
		},
		...(canWrite
			? [
					{
						href: "/dashboard",
						label: "Dashboard",
						description: "View posts and analytics",
					},
					{
						href: "/dashboard/posts/new",
						label: "Write",
						description: "Create a new story",
					},
				]
			: []),
		{
			href: user ? "/profile" : "/login",
			label: user ? "Profile" : "Login",
			description: user
				? "Manage your account"
				: "Sign in to your account",
		},
	];

	useEffect(() => {
		if (!open) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleEscape);
		};
	}, [open]);

	const isActiveLink = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<div className="md:hidden">
			<button
				type="button"
				aria-label="Open navigation menu"
				aria-expanded={open}
				aria-controls="mobile-navigation"
				onClick={() => setOpen(true)}
				className="group relative grid size-11 place-items-center overflow-hidden rounded-full border border-border/70 bg-surface shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-surface-muted hover:shadow-md"
			>
				<span className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10 opacity-0 transition-opacity group-hover:opacity-100" />

				<MenuIcon className="relative size-5 transition-transform duration-300 group-hover:scale-110" />
			</button>

			<AnimatePresence>
				{open ? (
					<motion.div
						id="mobile-navigation"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-50"
					>
						<motion.button
							type="button"
							aria-label="Close navigation menu"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setOpen(false)}
							className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-md"
						/>

						<motion.aside
							initial={{
								opacity: 0,
								x: "100%",
								scale: 0.98,
							}}
							animate={{
								opacity: 1,
								x: 0,
								scale: 1,
							}}
							exit={{
								opacity: 0,
								x: "100%",
								scale: 0.98,
							}}
							transition={{
								type: "spring",
								stiffness: 320,
								damping: 32,
							}}
							className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden border-l border-border/70 bg-background shadow-2xl"
						>
							<div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-500/15 blur-3xl" />
							<div className="pointer-events-none absolute -bottom-32 -left-28 size-72 rounded-full bg-pink-500/10 blur-3xl" />

							<header className="relative flex items-center justify-between border-b border-border/70 px-5 py-5">
								<Link
									href="/"
									onClick={() => setOpen(false)}
									className="group"
								>
									<p className="text-lg font-black tracking-[0.22em]">
										LUCID
									</p>
									<p className="mt-0.5 text-xs text-muted">
										Stories worth remembering
									</p>
								</Link>

								<button
									type="button"
									aria-label="Close navigation menu"
									onClick={() => setOpen(false)}
									className="group grid size-11 place-items-center rounded-full border border-border/70 bg-surface shadow-sm transition duration-300 hover:rotate-3 hover:bg-surface-muted"
								>
									<XIcon className="size-5 transition-transform duration-300 group-hover:rotate-90" />
								</button>
							</header>

							{user ? (
								<div className="relative px-5 pt-5">
									<div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-surface/80 p-4 shadow-sm backdrop-blur">
										<div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-base font-bold text-white shadow-lg shadow-violet-500/20">
											{user.name
												.split(" ")
												.map((part) => part[0])
												.join("")
												.slice(0, 2)
												.toUpperCase()}
										</div>

										<div className="min-w-0">
											<p className="truncate font-semibold">
												{user.name}
											</p>
											<p className="mt-0.5 text-xs capitalize text-muted">
												{user.role} account
											</p>
										</div>

										<span className="ml-auto size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
									</div>
								</div>
							) : null}

							<motion.nav
								variants={containerVariants}
								initial="hidden"
								animate="visible"
								className="relative flex-1 overflow-y-auto px-4 py-5"
							>
								<p className="mb-3 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted">
									Navigation
								</p>

								<div className="space-y-1.5">
									{links.map((link, index) => {
										const active = isActiveLink(link.href);

										return (
											<motion.div
												key={link.href}
												variants={linkVariants}
											>
												<Link
													href={link.href}
													onClick={() => setOpen(false)}
													className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl border px-4 py-4 transition duration-300 ${
														active
															? "border-violet-500/30 bg-gradient-to-r from-violet-500/15 via-pink-500/10 to-transparent shadow-sm"
															: "border-transparent hover:border-border/70 hover:bg-surface-muted/70"
													}`}
												>
													<span
														className={`grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-bold transition duration-300 ${
															active
																? "bg-foreground text-background shadow-lg"
																: "bg-surface text-muted group-hover:bg-foreground group-hover:text-background"
														}`}
													>
														{String(index + 1).padStart(2, "0")}
													</span>

													<span className="min-w-0 flex-1">
														<span className="block text-lg font-semibold leading-tight">
															{link.label}
														</span>

														<span className="mt-1 block truncate text-xs text-muted">
															{link.description}
														</span>
													</span>

													<span
														aria-hidden="true"
														className={`text-xl transition duration-300 ${
															active
																? "translate-x-0 opacity-100"
																: "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
														}`}
													>
														→
													</span>

													{active ? (
														<motion.span
															layoutId="mobile-active-link"
															className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-violet-500 to-pink-500"
														/>
													) : null}
												</Link>
											</motion.div>
										);
									})}
								</div>
							</motion.nav>

							<footer className="relative border-t border-border/70 px-5 py-5">
								<div className="flex items-center justify-between text-xs text-muted">
									<span>Read. Write. Inspire.</span>
									<span>© LUCID</span>
								</div>
							</footer>
						</motion.aside>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}