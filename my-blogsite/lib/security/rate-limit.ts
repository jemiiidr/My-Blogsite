import "server-only";

import { createHash } from "node:crypto";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { rateLimitEvents } from "@/lib/db/schema";

const CLEANUP_AGE_MS = 24 * 60 * 60 * 1000;

type RateLimitOptions = {
	action: string;
	identifier: string;
	limit: number;
	windowMs: number;
};

export type RateLimitResult = {
	allowed: boolean;
	retryAfterSeconds: number;
};

export async function getRequestIdentifier() {
	const requestHeaders = await headers();
	const forwardedFor = requestHeaders
		.get("x-forwarded-for")
		?.split(",")[0]
		?.trim();
	const ip =
		forwardedFor ||
		requestHeaders.get("x-real-ip") ||
		requestHeaders.get("cf-connecting-ip") ||
		"unknown";
	const userAgent = requestHeaders.get("user-agent") ?? "unknown-agent";
	return `${ip}:${userAgent.slice(0, 160)}`;
}

function hashIdentifier(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

export async function checkRateLimit({
	action,
	identifier,
	limit,
	windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
	const now = new Date();
	const windowStart = new Date(now.getTime() - windowMs);
	const keyHash = hashIdentifier(identifier);

	const [usage] = await db
		.select({ value: count() })
		.from(rateLimitEvents)
		.where(
			and(
				eq(rateLimitEvents.action, action),
				eq(rateLimitEvents.keyHash, keyHash),
				gte(rateLimitEvents.createdAt, windowStart),
			),
		);

	if ((usage?.value ?? 0) >= limit) {
		return {
			allowed: false,
			retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
		};
	}

	await db.insert(rateLimitEvents).values({ action, keyHash, createdAt: now });

	if (Math.random() < 0.02) {
		await db
			.delete(rateLimitEvents)
			.where(
				lt(rateLimitEvents.createdAt, new Date(now.getTime() - CLEANUP_AGE_MS)),
			);
	}

	return { allowed: true, retryAfterSeconds: 0 };
}
