import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "author", "user"]);
export const postStatusEnum = pgEnum("post_status", [
	"draft",
	"published",
	"archived",
]);

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		passwordHash: text("password_hash").notNull(),
		role: userRoleEnum("role").default("user").notNull(),
		slug: text("slug").notNull(),
		avatarUrl: text("avatar_url"),
		bio: text("bio").default("").notNull(),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("users_email_unique").on(table.email),
		uniqueIndex("users_slug_unique").on(table.slug),
	],
);

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [uniqueIndex("categories_slug_unique").on(table.slug)],
);

export const posts = pgTable(
	"posts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		slug: text("slug").notNull(),
		body: text("body").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		authorId: uuid("author_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		categoryId: uuid("category_id").references(() => categories.id, {
			onDelete: "set null",
		}),
		coverImageUrl: text("cover_image_url").notNull(),
		excerpt: text("excerpt").notNull(),
		status: postStatusEnum("status").default("draft").notNull(),
		publishedAt: timestamp("published_at"),
		tags: text("tags").array().default([]).notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [uniqueIndex("posts_slug_unique").on(table.slug)],
);

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorName: text("author_name").notNull(),
	body: text("body").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	userId: uuid("user_id").references(() => users.id, {
		onDelete: "set null",
	}),
	approved: boolean("approved").default(true).notNull(),
});

export const likes = pgTable(
	"likes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("likes_post_user_unique").on(table.postId, table.userId),
	],
);

export const postViews = pgTable("post_views", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id").references(() => users.id, {
		onDelete: "set null",
	}),
	visitorId: text("visitor_id"),
	viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const shares = pgTable("shares", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id").references(() => users.id, {
		onDelete: "set null",
	}),
	channel: text("channel").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	tokenHash: text("token_hash").primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ many, one }) => ({
	comments: many(comments),
	likes: many(likes),
	views: many(postViews),
	shares: many(shares),
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [posts.categoryId],
		references: [categories.id],
	}),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
	likes: many(likes),
	views: many(postViews),
	shares: many(shares),
	sessions: many(sessions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	posts: many(posts),
}));

export const likesRelations = relations(likes, ({ one }) => ({
	post: one(posts, { fields: [likes.postId], references: [posts.id] }),
	user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

export const postViewsRelations = relations(postViews, ({ one }) => ({
	post: one(posts, {
		fields: [postViews.postId],
		references: [posts.id],
	}),
	user: one(users, {
		fields: [postViews.userId],
		references: [users.id],
	}),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
	post: one(posts, { fields: [shares.postId], references: [posts.id] }),
	user: one(users, { fields: [shares.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
