export function parsePage(value: string | string[] | undefined) {
	const raw = Array.isArray(value) ? value[0] : value;
	const parsed = Number.parseInt(raw ?? "1", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
