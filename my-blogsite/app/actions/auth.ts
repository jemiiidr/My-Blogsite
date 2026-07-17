"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/db/queries/analytics";
import { createUniqueUserSlug } from "@/lib/db/queries/slugs";
import { users } from "@/lib/db/schema";
import {
	checkRateLimit,
	getRequestIdentifier,
} from "@/lib/security/rate-limit";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

export type LoginState = {
	message?: string;
	fieldErrors?: {
		email?: string[];
		password?: string[];
	};
};

export type SignupState = {
	message?: string;
	fieldErrors?: {
		name?: string[];
		email?: string[];
		password?: string[];
		confirmPassword?: string[];
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

	const requestIdentifier = await getRequestIdentifier();
	const rateLimit = await checkRateLimit({
		action: "auth:login",
		identifier: `${parsed.data.email.toLowerCase()}:${requestIdentifier}`,
		limit: 8,
		windowMs: 15 * 60 * 1000,
	});
	if (!rateLimit.allowed) {
		return {
			message: "Too many sign-in attempts. Please wait before trying again.",
		};
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

export async function signup(
	_previousState: SignupState,
	formData: FormData,
): Promise<SignupState> {
	const parsed = signupSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const email = parsed.data.email.toLowerCase();
	const requestIdentifier = await getRequestIdentifier();
	const rateLimit = await checkRateLimit({
		action: "auth:signup",
		identifier: `${email}:${requestIdentifier}`,
		limit: 5,
		windowMs: 60 * 60 * 1000,
	});
	if (!rateLimit.allowed) {
		return {
			message: "Too many registration attempts. Please try again later.",
		};
	}

	const [existingUser] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, email))
		.limit(1);
	if (existingUser) {
		return {
			fieldErrors: { email: ["An account already uses this email address."] },
			message: "Your account could not be created.",
		};
	}

	const slug = await createUniqueUserSlug(parsed.data.name);
	const [createdUser] = await db
		.insert(users)
		.values({
			name: parsed.data.name,
			email,
			passwordHash: hashPassword(parsed.data.password),
			role: "user",
			slug,
			avatarUrl: null,
			bio: "",
		})
		.returning({ id: users.id });

	await createSession(createdUser.id);
	revalidatePath("/", "layout");
	redirect("/profile");
}

export async function logout() {
	const parsed = z.object({}).safeParse({});
	if (!parsed.success) return;

	await deleteSession();
	revalidatePath("/", "layout");
	redirect("/");
}
