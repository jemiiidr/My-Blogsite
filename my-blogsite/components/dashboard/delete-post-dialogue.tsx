"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { type KeyboardEvent, type MouseEvent, useRef } from "react";
import { useFormStatus } from "react-dom";

import { deletePost } from "@/app/actions/posts";

type DeletePostDialogProps = {
	postId: string;
	postTitle: string;
};

function DeleteSubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-fail px-5 py-2.5 text-fail-txt font-semibold transition hover:bg-[#FF92A1] disabled:cursor-not-allowed disabled:opacity-60"
		>
			<Trash2 className="size-4" />

			{pending ? "Deleting..." : "Delete"}
		</button>
	);
}

export function DeletePostDialog({ postId, postTitle }: DeletePostDialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	function openDialog() {
		dialogRef.current?.showModal();
	}

	function closeDialog() {
		dialogRef.current?.close();
	}

	function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
		if (event.target === event.currentTarget) {
			closeDialog();
		}
	}

	function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
		if (event.key === "Escape") {
			event.preventDefault();
			closeDialog();
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={openDialog}
				className="inline-flex items-center justify-center gap-2 rounded-full border border-fail px-4 py-2 text-sm font-semibold text-fail-txt transition hover:border-fail-txt hover:bg-fail "
			>
				<Trash2 className="size-4" />
				Delete
			</button>

			<dialog
				ref={dialogRef}
				aria-labelledby={`delete-post-title-${postId}`}
				aria-describedby={`delete-post-description-${postId}`}
				onClick={handleBackdropClick}
				onKeyDown={handleDialogKeyDown}
				className="m-auto w-[calc(100%-2rem)] max-w-md rounded-4xl border border-border bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
			>
				<div className="relative overflow-hidden p-6 sm:p-7">
					<div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-rose-500/10 blur-3xl" />

					<div className="relative">
						<div className="flex items-start justify-between gap-4">
							<div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-fail text-fail-txt">
								<AlertTriangle className="size-5" />
							</div>

							<button
								type="button"
								aria-label="Close confirmation dialog"
								onClick={closeDialog}
								className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted transition hover:bg-surface-muted hover:text-foreground"
							>
								<X className="size-4" />
							</button>
						</div>

						<div className="mt-5">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
								Permanent action
							</p>

							<h2
								id={`delete-post-title-${postId}`}
								className="mt-2 text-2xl font-semibold tracking-tight"
							>
								Delete this story?
							</h2>

							<p
								id={`delete-post-description-${postId}`}
								className="mt-3 text-sm leading-6 text-muted"
							>
								You are about to permanently delete{" "}
								<span className="font-semibold text-foreground">
									“{postTitle}”
								</span>
								. Its comments, likes, views, and other related data may also be
								removed.
							</p>
						</div>

						<div className="mt-5 rounded-2xl border border-fail bg-fail/40 p-4 text-sm leading-6 text-fail-txt">
							This action cannot be undone.
						</div>

						<form
							action={deletePost}
							className="mt-6 flex flex-col-reverse gap-2 sm:flex-row"
						>
							<input type="hidden" name="postId" value={postId} />

							<button
								type="button"
								onClick={closeDialog}
								className="min-h-11 flex-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-surface-muted"
							>
								Keep story
							</button>

							<DeleteSubmitButton />
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
