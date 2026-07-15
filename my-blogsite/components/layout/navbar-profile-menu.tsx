"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { logout } from "@/app/actions/auth";
import { Avatar } from "@/components/ui/avatar";

type NavbarProfileMenuProps = {
	user: {
		name: string;
        slug: string;
		role: "admin" | "author" | "user";
		avatarUrl: string | null;
	};
};

function SignOutButton({ closeMenu }: { closeMenu: () => void }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			role="menuitem"
			disabled={pending}
			onClick={closeMenu}
			className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-fail-txt transition hover:bg-fail/60 disabled:cursor-not-allowed disabled:opacity-60"
		>
			<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-fail text-fail-txt">
				<LogOut className="size-4" />
			</span>

			<span>{pending ? "Signing out..." : "Sign out"}</span>
		</button>
	);
}

export function NavbarProfileMenu({ user }: NavbarProfileMenuProps) {
	const _pathname = usePathname();
	const menuId = useId();
	const containerRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	const isAdmin = user.role === "admin";
	const isAuthor = user.role === "author";

	useEffect(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		function handlePointerDown(event: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setOpen(false);
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				aria-label="Open profile menu"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={menuId}
				onClick={() => setOpen((currentOpen) => !currentOpen)}
				className={[
					"group flex items-center gap-2 rounded-full border p-1.5 pr-2.5 transition",
					open
						? "border-accent bg-accent-soft"
						: "border-border bg-surface hover:border-accent hover:bg-surface-muted",
				].join(" ")}
			>
				<Avatar name={user.name} src={user.avatarUrl} size={34} />

				<ChevronDown
					className={[
						"size-4 text-muted transition-transform duration-200",
						open ? "rotate-180 text-accent" : "",
					].join(" ")}
				/>
			</button>

			<AnimatePresence>
				{open ? (
					<motion.div
						id={menuId}
						role="menu"
						aria-label="Profile menu"
						initial={{
							opacity: 0,
							y: -8,
							scale: 0.96,
						}}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							y: -6,
							scale: 0.97,
						}}
						transition={{
							duration: 0.18,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 origin-top-right overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-2xl"
					>
						<div className="rounded-2xl bg-surface-muted p-3">
							<div className="flex items-center gap-3">
								<Avatar name={user.name} src={user.avatarUrl} size={44} />

								<div className="min-w-0">
									<p className="truncate text-sm font-semibold">{user.name}</p>

									<p className="mt-0.5 text-xs capitalize text-muted">
										{user.role} account
									</p>
								</div>
							</div>
						</div>

						<nav aria-label="Account navigation" className="mt-2 space-y-1">
                            {isAdmin || isAuthor ? (
                                <Link
                                    href={`/authors/${user.slug}`}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition hover:bg-surface-muted"
                                >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                                        <UserRound className="size-4" />
                                    </span>

                                    Profile
                                </Link>
							) : null}

							{isAdmin ? (
								<Link
									href="/dashboard"
									role="menuitem"
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition hover:bg-surface-muted"
								>
									<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
										<LayoutDashboard className="size-4" />
									</span>
									Dashboard
								</Link>
							) : null}
						</nav>

						<div className="my-2 border-t border-border" />

						<form action={logout}>
							<SignOutButton closeMenu={() => setOpen(false)} />
						</form>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
