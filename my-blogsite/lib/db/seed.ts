import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { hashPassword } from "@/lib/auth/password";

import {
	categories,
	comments,
	likes,
	posts,
	postViews,
	sessions,
	shares,
	users,
} from "@/lib/db/schema";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
	throw new Error(
		"DATABASE_URL is missing. Run this script with .env.local loaded or set the variable in your shell.",
	);

const db = drizzle(neon(connectionString));

const adminId = randomUUID();
const authorId = randomUUID();
const userId = randomUUID();
const designId = randomUUID();
const cultureId = randomUUID();
const technologyId = randomUUID();
const postIds = [randomUUID(), randomUUID(), randomUUID()];

const storyBody = (heading: string, quote: string) => `
<p>Some ideas ask to be consumed quickly. Others invite us to slow down, notice the edges, and understand why they matter.</p>
<h2>${heading}</h2>
<p>Modern storytelling is not only about presenting information. It is about arranging rhythm, contrast, and context so that the reader can make a meaningful connection.</p>
<blockquote>${quote}</blockquote>
<h3>Designing for attention</h3>
<p>A strong story gives every section a purpose. Clear headings create direction, thoughtful details build trust, and a calm visual system leaves room for the idea itself.</p>
<ul><li>Begin with a specific point of view.</li><li>Use evidence and examples to deepen the idea.</li><li>End by giving the reader something to carry forward.</li></ul>
<p>The best digital experiences feel both useful and human. That balance is what LUCID is designed to explore.</p>`;

async function seed() {
	console.log("Resetting demo data...");
	await db.delete(sessions);
	await db.delete(shares);
	await db.delete(postViews);
	await db.delete(likes);
	await db.delete(comments);
	await db.delete(posts);
	await db.delete(categories);
	await db.delete(users);

	await db.insert(users).values([
		{
			id: adminId,
			name: "Jamie Rivera",
			email: "admin@lucid.local",
			passwordHash: hashPassword("Admin123!"),
			role: "admin",
			slug: "jamie-rivera",
			avatarUrl: "/images/avatars/jamie.svg",
			bio: "Editor-in-chief exploring the craft, systems, and culture behind meaningful digital stories.",
		},
		{
			id: authorId,
			name: "Maya Chen",
			email: "author@lucid.local",
			passwordHash: hashPassword("Author123!"),
			role: "author",
			slug: "maya-chen",
			avatarUrl: "/images/avatars/maya.svg",
			bio: "Product designer and writer focused on creative practice, technology, and visual culture.",
		},
		{
			id: userId,
			name: "Noah Santos",
			email: "reader@lucid.local",
			passwordHash: hashPassword("Reader123!"),
			role: "user",
			slug: "noah-santos",
			avatarUrl: "/images/avatars/noah.svg",
			bio: "Curious reader and community member.",
		},
	]);

	await db.insert(categories).values([
		{ id: designId, name: "Design", slug: "design" },
		{ id: cultureId, name: "Culture", slug: "culture" },
		{ id: technologyId, name: "Technology", slug: "technology" },
	]);

	const publishedAt = new Date();
	await db.insert(posts).values([
		{
			id: postIds[0],
			title: "Designing Digital Spaces That Feel Human",
			slug: "designing-digital-spaces-that-feel-human",
			excerpt:
				"A practical look at how rhythm, restraint, and empathy turn interfaces into places people enjoy returning to.",
			body: storyBody(
				"A quieter kind of interface",
				"Good design does not demand attention. It earns it by making the next step feel natural.",
			),
			authorId: adminId,
			categoryId: designId,
			coverImageUrl: "/images/posts/story-gradient.svg",
			status: "published",
			publishedAt,
			tags: ["design", "experience", "storytelling"],
		},
		{
			id: postIds[1],
			title: "The Creative Rituals Behind Consistent Work",
			slug: "creative-rituals-behind-consistent-work",
			excerpt:
				"Why reliable creative habits matter more than waiting for inspiration, and how to build a practice that lasts.",
			body: storyBody(
				"Ritual over inspiration",
				"Consistency gives inspiration somewhere to arrive.",
			),
			authorId: authorId,
			categoryId: cultureId,
			coverImageUrl: "/images/posts/creative-orbit.svg",
			status: "published",
			publishedAt: new Date(Date.now() - 86_400_000 * 2),
			tags: ["creativity", "habits", "culture"],
		},
		{
			id: postIds[2],
			title: "Small Technologies, Meaningful Futures",
			slug: "small-technologies-meaningful-futures",
			excerpt:
				"The most useful innovations are often modest tools that remove friction and help communities act with confidence.",
			body: storyBody(
				"Progress at a human scale",
				"Technology becomes meaningful when it expands what ordinary people are able to do.",
			),
			authorId: authorId,
			categoryId: technologyId,
			coverImageUrl: "/images/posts/future-shapes.svg",
			status: "published",
			publishedAt: new Date(Date.now() - 86_400_000 * 5),
			tags: ["technology", "future", "community"],
		},
	]);

	await db.insert(comments).values([
		{
			postId: postIds[0],
			userId,
			authorName: "Noah Santos",
			body: "The point about restraint really changed how I think about interface design.",
			approved: true,
		},
		{
			postId: postIds[0],
			authorName: "Guest Reader",
			body: "Clear, thoughtful, and easy to apply. I especially liked the section on rhythm.",
			approved: true,
		},
		{
			postId: postIds[1],
			authorName: "Ari",
			body: "I needed this reminder that a routine can protect creative energy.",
			approved: true,
		},
	]);
	await db.insert(likes).values([
		{ postId: postIds[0], userId },
		{ postId: postIds[1], userId },
	]);
	await db.insert(postViews).values(
		Array.from({ length: 18 }, (_, index) => ({
			postId: postIds[index % 3],
			visitorId: `seed-visitor-${index}`,
			viewedAt: new Date(Date.now() - 86_400_000 * (index % 7)),
		})),
	);
	await db.insert(shares).values([
		{ postId: postIds[0], userId, channel: "copy" },
		{ postId: postIds[0], channel: "native" },
		{ postId: postIds[2], channel: "linkedin" },
	]);

	console.log("Seed complete: 3 accounts, 3 categories, 3 published stories.");
}

seed().catch((error) => {
	console.error(error);
	process.exit(1);
});
