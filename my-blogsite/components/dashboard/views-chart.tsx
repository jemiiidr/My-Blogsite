export function ViewsChart({ data }: { data: Array<{ date: string; value: number }> }) {
	const max = Math.max(...data.map((item) => item.value), 1);
	return (
		<div className="rounded-3xl border bg-surface p-5 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<div><p className="font-semibold">Views over time</p><p className="text-sm text-muted">Last 14 active days</p></div>
			</div>
			{data.length ? (
				<div className="flex h-52 items-end gap-2" aria-label="Views chart">
					{data.map((item) => (
						<div key={item.date} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
							<span className="text-xs font-semibold opacity-0 transition group-hover:opacity-100">{item.value}</span>
							<div className="w-full rounded-t-xl bg-gradient-to-t from-accent to-fuchsia-300 transition group-hover:brightness-110" style={{ height: `${Math.max((item.value / max) * 150, 8)}px` }} />
							<span className="hidden text-[10px] text-muted sm:block">{item.date.slice(5)}</span>
						</div>
					))}
				</div>
			) : <div className="grid h-52 place-items-center rounded-2xl bg-surface-muted text-sm text-muted">Views will appear after readers visit your posts.</div>}
		</div>
	);
}
