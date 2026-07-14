"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MenuIcon, XIcon } from "@/components/ui/icons";

type MobileUser = {
	name: string;
	role: "admin" | "author" | "user";
} | null;

export function MobileMenu({ user }: { user: MobileUser }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";

		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

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
		{
			href: user ? "/profile" : "/login",
			label: user ? "Profile" : "Login",
		},
	];

	return (
		<div className="md:hidden">
			<motion.button
				type="button"
				aria-label="Open navigation menu"
				onClick={() => setOpen(true)}
				whileHover={{ scale: 1.06 }}
				whileTap={{ scale: 0.92 }}
				transition={{ duration: 0.2 }}
				className="grid size-10 place-items-center rounded-full border bg-surface shadow-sm"
			>
				<MenuIcon className="size-5" />
			</motion.button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-50 min-h-screen bg-surface-muted backdrop-blur-xl"
						onClick={() => setOpen(false)}
					>
						<motion.div
							initial={{ y: 30, opacity: 0 }}
							animate={{
								y: 0,
								opacity: 1,
								transition: {
									duration: 0.35,
									ease: "easeOut",
								},
							}}
							exit={{
								y: 30,
								opacity: 0,
								transition: {
									duration: 0.2,
									ease: "easeIn",
								},
							}}
							onClick={(event) => event.stopPropagation()}
							className="flex h-full flex-col px-6 py-6"
						>
							<div className="flex justify-end">
								<motion.button
									type="button"
									aria-label="Close navigation menu"
									onClick={() => setOpen(false)}
									whileHover={{ rotate: 90 }}
									whileTap={{ scale: 0.9, rotate: 90 }}
									transition={{ duration: 0.2 }}
									className="grid size-11 place-items-center rounded-full border bg-surface shadow-sm"
								>
									<XIcon className="size-5" />
								</motion.button>
							</div>

							<nav className="mt-16 flex flex-col gap-3">
								{links.map((link, index) => (
									<motion.div
										key={link.href}
										initial={{
											opacity: 0,
											x: -20,
										}}
										animate={{
											opacity: 1,
											x: 0,
										}}
										exit={{
											opacity: 0,
											x: -20,
										}}
										transition={{
											duration: 0.3,
											delay: index * 0.06,
											ease: "easeOut",
										}}
										whileHover={{
											x: 10,
										}}
										whileTap={{
											scale: 0.97,
										}}
										className="w-full"
									>
										<Link
											href={link.href}
											onClick={() => setOpen(false)}
											className="block w-full rounded-2xl border border-transparent px-5 py-4 text-3xl font-semibold transition-all duration-300 hover:border-accent/20 hover:bg-accent-soft hover:text-accent hover:shadow-sm focus-visible:border-accent/30 focus-visible:bg-accent-soft focus-visible:text-accent active:border-accent/30 active:bg-accent-soft active:text-accent"
										>
											{link.label}
										</Link>
									</motion.div>
								))}
							</nav>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}