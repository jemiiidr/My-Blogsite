export function Badge({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={`inline-flex items-center rounded-full border bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted ${className}`}
		>
			{children}
		</span>
	);
}
