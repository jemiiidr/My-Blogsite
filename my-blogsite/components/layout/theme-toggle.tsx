"use client";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setMounted(true);
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggleTheme() {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle("dark", next);
		document.documentElement.style.colorScheme = next ? "dark" : "light";
		localStorage.setItem("lucid-theme", next ? "dark" : "light");
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle light and dark theme"
			className="grid size-10 place-items-center rounded-full border bg-surface text-foreground transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
		>
			{mounted && isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
		</button>
	);
}
