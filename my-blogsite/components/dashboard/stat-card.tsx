import { MotionCard } from "@/components/motion/motion-card";

export function StatCard({ label, value, note }: { label: string; value: number | string; note?: string }) {
	return (
		<MotionCard className="rounded-3xl border bg-surface p-5 shadow-sm">
			<p className="text-sm text-muted">{label}</p>
			<p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
			{note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
		</MotionCard>
	);
}
