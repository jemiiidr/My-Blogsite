import Link from "next/link";

export function Logo() {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 font-semibold tracking-tight"
		>
			<span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-400 to-cyan-300 text-sm font-black text-white shadow-sm">
				L
			</span>
			<span>LUCID</span>
		</Link>
	);
}
