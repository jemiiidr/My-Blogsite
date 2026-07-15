"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { getUserByEmail } from "@/lib/db/queries/analytics";
import { loginSchema } from "@/lib/validations/auth";

export type LoginState = {
	message?: string;
	fieldErrors?: {
		email?: string[];
		password?: string[];
	};
};

export async function login(
	_previousState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const user = await getUserByEmail(parsed.data.email);
	if (!user?.isActive) {
		return { message: "Invalid email or password." };
	}

	const passwordMatches = verifyPassword(
		parsed.data.password,
		user.passwordHash,
	);
	if (!passwordMatches) {
		return { message: "Invalid email or password." };
	}

	await createSession(user.id);
	revalidatePath("/", "layout");
	redirect(user.role === "user" ? "/profile" : "/dashboard");
}

export async function logout() {
	const parsed = z.object({}).safeParse({});
	if (!parsed.success) return;

	await deleteSession();
	revalidatePath("/", "layout");
	redirect("/");
}
