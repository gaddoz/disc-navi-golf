CREATE TABLE `courses` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` integer PRIMARY KEY NOT NULL,
	`course_id` integer,
	`name` text DEFAULT '' NOT NULL,
	`type` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text DEFAULT '' NOT NULL,
	`password` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_id_unique` ON `courses` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `points_id_unique` ON `points` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);