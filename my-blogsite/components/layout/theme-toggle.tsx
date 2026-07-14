"use client";

import { useTheme } from "next-themes";
import { type MouseEvent, type SVGProps, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === "dark";

	function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
		if (!mounted) {
			return;
		}

		const nextTheme = isDark ? "light" : "dark";
		const buttonRect = event.currentTarget.getBoundingClientRect();

		// Keyboard-triggered clicks may report 0 for clientX and clientY.
		const x = event.clientX || buttonRect.left + buttonRect.width / 2;
		const y = event.clientY || buttonRect.top + buttonRect.height / 2;

		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y),
		);

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!document.startViewTransition || prefersReducedMotion) {
			setTheme(nextTheme);
			return;
		}

		const transition = document.startViewTransition(() => {
			flushSync(() => {
				setTheme(nextTheme);
			});
		});

		transition.ready
			.then(() => {
				document.documentElement.animate(
					{
						clipPath: [
							`circle(0px at ${x}px ${y}px)`,
							`circle(${endRadius}px at ${x}px ${y}px)`,
						],
					},
					{
						duration: 800,
						easing: "cubic-bezier(0.22, 1, 0.36, 1)",
						pseudoElement: "::view-transition-new(root)",
					},
				);
			})
			.catch(() => {
				// The theme has already changed, so no further action is needed.
			});
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			disabled={!mounted}
			aria-label={
				mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"
			}
			title={
				mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"
			}
			className="grid size-10 place-items-center rounded-full border bg-surface text-muted transition duration-300 hover:border-accent hover:text-accent disabled:cursor-default"
		>
			{mounted ? (
				isDark ? (
					<MoonIcon className="size-4" />
				) : (
					<SunIcon className="size-4" />
				)
			) : (
				<span className="size-4" aria-hidden="true" />
			)}
		</button>
	);
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	);
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401Z" />
		</svg>
	);
}
