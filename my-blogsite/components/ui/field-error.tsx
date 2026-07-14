export function FieldError({ errors }: { errors?: string[] }) {
	if (!errors?.length) return null;
	return (
		<div className="mt-1 space-y-1" role="alert">
			{errors.map((error) => (
				<p key={error} className="text-sm text-rose-600 dark:text-rose-400">
					{error}
				</p>
			))}
		</div>
	);
}
