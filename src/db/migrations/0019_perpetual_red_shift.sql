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
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_budgets`("id", "title", "type", "start_date", "end_date", "amount", "icon", "icon_color", "enable_notify", "auto_renew", "is_active", "user_id", "created_at", "updated_at") SELECT "id", "title", "type", "start_date", "end_date", "amount", "icon", "icon_color", "enable_notify", "auto_renew", "is_active", "user_id", "created_at", "updated_at" FROM `budgets`;--> statement-breakpoint
DROP TABLE `budgets`;--> statement-breakpoint
ALTER TABLE `__new_budgets` RENAME TO `budgets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category_id` text NOT NULL,
	`amount` integer NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "title", "category_id", "amount", "description", "user_id", "created_at", "updated_at") SELECT "id", "title", "category_id", "amount", "description", "user_id", "created_at", "updated_at" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
CREATE TABLE `__new_expense_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`expense_id` text NOT NULL,
	`user_provider_id` text NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_provider_id`) REFERENCES `user_providers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_expense_providers`("id", "expense_id", "user_provider_id") SELECT "id", "expense_id", "user_provider_id" FROM `expense_providers`;--> statement-breakpoint
DROP TABLE `expense_providers`;--> statement-breakpoint
ALTER TABLE `__new_expense_providers` RENAME TO `expense_providers`;--> statement-breakpoint
CREATE TABLE `__new_user_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`identifier` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_providers`("id", "user_id", "identifier", "description", "created_at", "updated_at") SELECT "id", "user_id", "identifier", "description", "created_at", "updated_at" FROM `user_providers`;--> statement-breakpoint
DROP TABLE `user_providers`;--> statement-breakpoint
ALTER TABLE `__new_user_providers` RENAME TO `user_providers`;