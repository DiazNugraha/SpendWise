PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`identifier` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_providers`("id", "user_id", "provider_id", "identifier", "created_at", "updated_at") SELECT "id", "user_id", "provider_id", "identifier", "created_at", "updated_at" FROM `user_providers`;--> statement-breakpoint
DROP TABLE `user_providers`;--> statement-breakpoint
ALTER TABLE `__new_user_providers` RENAME TO `user_providers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;