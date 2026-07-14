import Image from "next/image";

export function Avatar({
	name,
	src,
	size = 40,
	className = "",
}: {
	name: string;
	src?: string | null;
	size?: number;
	className?: string;
}) {
	const initials = name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	if (src) {
		return (
			<Image
				src={src}
				alt={`${name} profile picture`}
				width={size}
				height={size}
				unoptimized={src.startsWith("http")}
				className={`rounded-full border object-cover ${className}`}
				style={{ width: size, height: size }}
			/>
		);
	}

	return (
		<div
			aria-label={`${name} profile picture placeholder`}
			className={`grid shrink-0 place-items-center rounded-full border bg-accent-soft font-semibold text-accent ${className}`}
			style={{ width: size, height: size }}
		>
			{initials}
		</div>
	);
}
