import { promoteUserToAuthor } from "@/app/actions/authors";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

type PromotableUser = {
	id: string;
	name: string;
	email: string;
};

type CreateAuthorFormProps = {
	users: PromotableUser[];
};

export function CreateAuthorForm({ users }: CreateAuthorFormProps) {
	return (
		<section className="rounded-3xl border bg-surface p-5 shadow-sm">
			<h2 className="text-lg font-semibold">Promote a user</h2>

			<p className="mt-1 text-sm text-muted">
				Select an existing registered user and grant them author access.
			</p>

			{users.length > 0 ? (
				<form action={promoteUserToAuthor} className="mt-5">
					<div>
						<label htmlFor="userId" className="mb-2 block text-sm font-medium">
							Registered user
						</label>

						<select
							id="userId"
							name="userId"
							defaultValue=""
							required
							className="w-full rounded-xl border bg-background px-4 py-3 text-foreground"
						>
							<option value="" disabled>
								Select a user
							</option>

							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name} ({user.email})
								</option>
							))}
						</select>
					</div>

					<div className="mt-5">
						<FormSubmitButton pendingLabel="Making author...">
							Make author
						</FormSubmitButton>
					</div>
				</form>
			) : (
				<p className="mt-5 rounded-xl bg-surface-muted p-4 text-sm text-muted">
					There are no active registered users available to promote.
				</p>
			)}
		</section>
	);
}
