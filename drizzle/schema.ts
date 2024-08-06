import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey().unique().notNull(),
  username: text("username").notNull().default(""),
  password: text("password").notNull().default(""),
});

export const Courses = sqliteTable("courses", {
  id: integer("id").primaryKey().unique().notNull(),
  name: text("name").notNull().default(""),
});

export const Points = sqliteTable("points", {
  id: integer("id").primaryKey().unique().notNull(),
  courseId: integer("course_id").references(() => Courses.id),
  name: text("name").notNull().default(""),
  type: text("type").notNull().default(""),
  location: text("location").notNull().default(""),
});

