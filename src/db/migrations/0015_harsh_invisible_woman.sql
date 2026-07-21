PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`email` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`primary_currency_code` text,
	`is_guest` integer DEFAULT true NOT NULL,
	`avatar_url` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "first_name", "last_name", "email", "created_at", "updated_at", "primary_currency_code", "is_guest", "avatar_url") SELECT "id", "first_name", "last_name", "email", "created_at", "updated_at", "primary_currency_code", "is_guest", "avatar_url" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);