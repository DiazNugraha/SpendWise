PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`amount` integer NOT NULL,
	`icon` text,
	`icon_color` text,
	`enable_notify` integer DEFAULT false NOT NULL,
	`auto_renew` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_budgets`("id", "title", "type", "start_date", "end_date", "amount", "icon", "icon_color", "enable_notify", "auto_renew", "is_active", "user_id", "created_at", "updated_at") SELECT "id", "title", "type", "start_date", "end_date", "amount", "icon", "icon_color", "enable_notify", "auto_renew", "is_active", "user_id", "created_at", "updated_at" FROM `budgets`;--> statement-breakpoint
DROP TABLE `budgets`;--> statement-breakpoint
ALTER TABLE `__new_budgets` RENAME TO `budgets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;