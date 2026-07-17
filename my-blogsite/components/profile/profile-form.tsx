"use client";

import Image from "next/image";
import {
	type ChangeEvent,
	type FormEvent,
	startTransition,
	useActionState,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { type ProfileState, updateProfile } from "@/app/actions/profile";
import { FieldError } from "@/components/ui/field-error";

type ProfileFormProps = {
	user: {
		name: string;
		bio: string;
		avatarUrl: string | null;
	};
};

const initialState: ProfileState = {
	success: false,
};

export function ProfileForm({ user }: ProfileFormProps) {
	const [state, formAction, pending] = useActionState(
		updateProfile,
		initialState,
	);

	const [name, setName] = useState(user.name);
	const [bio, setBio] = useState(user.bio);

	const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
		user.avatarUrl,
	);

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const [selectedFileName, setSelectedFileName] = useState("");
	const [removeAvatar, setRemoveAvatar] = useState(false);

	const avatarObjectUrlRef = useRef<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const displayedAvatar = removeAvatar
		? null
		: (avatarPreview ?? currentAvatarUrl);

	const userInitial = name.trim().charAt(0).toUpperCase() || "U";

	const clearAvatarObjectUrl = useCallback(() => {
		if (!avatarObjectUrlRef.current) {
			return;
		}

		URL.revokeObjectURL(avatarObjectUrlRef.current);
		avatarObjectUrlRef.current = null;
	}, []);

	function clearSelectedFile() {
		clearAvatarObjectUrl();

		setAvatarPreview(null);
		setSelectedFileName("");

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.target.files?.[0];

		clearAvatarObjectUrl();

		if (!selectedFile) {
			setAvatarPreview(null);
			setSelectedFileName("");
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);

		avatarObjectUrlRef.current = objectUrl;

		setAvatarPreview(objectUrl);
		setSelectedFileName(selectedFile.name);
		setRemoveAvatar(false);
	}

	function handleClearSelectedAvatar() {
		clearSelectedFile();
		setRemoveAvatar(false);
	}

	function handleRemoveAvatar() {
		clearSelectedFile();
		setRemoveAvatar(true);
	}

	function handleUndoRemoveAvatar() {
		setRemoveAvatar(false);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;

		if (!form.reportValidity()) {
			return;
		}

		const formData = new FormData(form);

		startTransition(() => {
			formAction(formData);
		});
	}

	useEffect(() => {
		if (!state.success) {
			return;
		}

		if (state.avatarUrl !== undefined) {
			setCurrentAvatarUrl(state.avatarUrl);
		}

		clearAvatarObjectUrl();
		setAvatarPreview(null);
		setSelectedFileName("");
		setRemoveAvatar(false);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [state.success, state.avatarUrl, clearAvatarObjectUrl]);

	useEffect(() => {
		return () => {
			if (avatarObjectUrlRef.current) {
				URL.revokeObjectURL(avatarObjectUrlRef.current);
			}
		};
	}, []);

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-8 rounded-4xl border border-border bg-surface p-6 shadow-sm sm:p-8"
		>
			<input
				type="hidden"
				name="removeAvatar"
				value={removeAvatar ? "true" : "false"}
			/>

			<div className="flex flex-col gap-6 sm:flex-row sm:items-center">
				<div className="relative size-28 shrink-0 overflow-hidden rounded-full border border-border bg-surface-muted">
					{displayedAvatar ? (
						<Image
							src={displayedAvatar}
							alt={`${name}'s profile picture`}
							fill
							sizes="112px"
							className="object-cover"
							unoptimized={
								displayedAvatar.startsWith("blob:") ||
								!displayedAvatar.startsWith("/")
							}
						/>
					) : (
						<div className="flex size-full items-center justify-center text-4xl font-semibold text-muted">
							{userInitial}
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1 space-y-3">
					<label htmlFor="avatar" className="block text-sm font-semibold">
						Profile picture
					</label>

					<input
						ref={fileInputRef}
						id="avatar"
						name="avatar"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleAvatarChange}
						className="block w-full rounded-2xl border border-border bg-background text-sm file:mr-3 file:border-0 file:border-r file:border-border file:bg-surface-muted file:px-4 file:py-3 file:text-sm file:font-semibold hover:file:bg-accent-soft"
					/>

					<div className="flex flex-wrap gap-2">
						{selectedFileName ? (
							<button
								type="button"
								onClick={handleClearSelectedAvatar}
								className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:border-accent hover:bg-accent-soft"
							>
								Clear selected image
							</button>
						) : null}

						{removeAvatar ? (
							<button
								type="button"
								onClick={handleUndoRemoveAvatar}
								className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:border-accent hover:bg-accent-soft"
							>
								Undo removal
							</button>
						) : currentAvatarUrl && !selectedFileName ? (
							<button
								type="button"
								onClick={handleRemoveAvatar}
								className="rounded-full border border-fail px-4 py-2 text-xs font-semibold text-fail-txt transition hover:bg-fail"
							>
								Remove profile picture
							</button>
						) : null}
					</div>

					<p className="text-xs text-muted">
						{removeAvatar
							? "Your profile picture will be removed after saving."
							: selectedFileName
								? `Selected: ${selectedFileName}`
								: "JPG, PNG, or WebP. Maximum 2 MB."}
					</p>

					<FieldError errors={state.fieldErrors?.avatar} />
				</div>
			</div>

			<div>
				<label htmlFor="name" className="mb-2 block text-sm font-semibold">
					Display name
				</label>

				<input
					id="name"
					name="name"
					type="text"
					value={name}
					onChange={(event) => setName(event.target.value)}
					minLength={2}
					maxLength={80}
					required
					className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
				/>

				<FieldError errors={state.fieldErrors?.name} />
			</div>

			<div>
				<label htmlFor="bio" className="mb-2 block text-sm font-semibold">
					Bio
				</label>

				<textarea
					id="bio"
					name="bio"
					value={bio}
					onChange={(event) => setBio(event.target.value)}
					rows={6}
					maxLength={500}
					placeholder="Tell readers something about yourself."
					className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:border-accent"
				/>

				<div className="mt-1 text-right text-xs text-muted">
					{bio.length}/500
				</div>

				<FieldError errors={state.fieldErrors?.bio} />
			</div>

			{state.message ? (
				<p
					role="status"
					className={
						state.success
							? "rounded-2xl border border-success bg-emerald-success p-4 text-sm text-success-txt"
							: "rounded-2xl border border-fail bg-fail p-4 text-sm text-fail-txt"
					}
				>
					{state.message}
				</p>
			) : null}

			<button
				type="submit"
				disabled={pending}
				className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{pending ? "Saving profile..." : "Save profile"}
			</button>
		</form>
	);
}
