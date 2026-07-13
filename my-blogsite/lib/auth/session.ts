import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";

const SESSION_COOKIE = "lucid_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function hashToken(token: string) {
	const secret = process.env.SESSION_SECRET;
	if (!secret) throw new Error("SESSION_SECRET is not defined.");
	return createHmac("sha256", secret).update(token).digest("hex");
}

export async function createSession(userId: string) {
	const token = randomBytes(32).toString("base64url");
	const tokenHash = hashToken(token);
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	await db.insert(sessions).values({ tokenHash, userId, expiresAt });

	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: expiresAt,
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;

	if (token) {
		await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
	}

	cookieStore.delete(SESSION_COOKIE);
}

export async function readSessionUser() {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!token) return null;

	const [row] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
			slug: users.slug,
			avatarUrl: users.avatarUrl,
			bio: users.bio,
			isActive: users.isActive,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(
			and(
				eq(sessions.tokenHash, hashToken(token)),
				gt(sessions.expiresAt, new Date()),
				eq(users.isActive, true),
			),
		)
		.limit(1);

	return row ?? null;
}
