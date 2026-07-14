"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { MenuIcon, XIcon } from "@/components/ui/icons";

type MobileUser = {
	name: string;
	role: "admin" | "author" | "user";
} | null;

export function MobileMenu({ user }: { user: MobileUser }) {
	const [open, setOpen] = useState(false);
	const links = [
		{ href: "/", label: "Home" },
		{ href: "/blog", label: "Blog" },
		{ href: "/authors", label: "Authors" },
		...(user?.role === "admin" || user?.role === "author"
			? [
					{ href: "/dashboard", label: "Dashboard" },
					{ href: "/dashboard/posts/new", label: "Write" },
				]
			: []),
		{ href: user ? "/profile" : "/login", label: user ? "Profile" : "Login" },
	];

	return (
		<div className="md:hidden">
			<button
				type="button"
				aria-label="Open navigation menu"
				onClick={() => setOpen(true)}
				className="grid size-10 place-items-center rounded-full border bg-surface"
			>
				<MenuIcon className="size-5" />
			</button>
			<AnimatePresence>
				{open ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-background/95 p-5 backdrop-blur-xl"
					>
						<div className="flex justify-end">
							<button
								type="button"
								aria-label="Close navigation menu"
								onClick={() => setOpen(false)}
								className="grid size-11 place-items-center rounded-full border bg-surface"
							>
								<XIcon className="size-5" />
							</button>
						</div>
						<motion.nav
							initial={{ y: 16 }}
							animate={{ y: 0 }}
							className="mt-14 flex flex-col gap-2"
						>
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className="rounded-2xl px-4 py-4 text-3xl font-semibold transition hover:bg-surface-muted"
								>
									{link.label}
								</Link>
							))}
						</motion.nav>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
