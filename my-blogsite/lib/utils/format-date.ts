export function formatDate(value: Date | string | null | undefined) {
	if (!value) return "Unpublished";
	return new Intl.DateTimeFormat("en-PH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(new Date(value));
}

export function formatCompactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}
