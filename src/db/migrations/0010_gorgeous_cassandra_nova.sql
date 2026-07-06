PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`expense_id` text NOT NULL,
	`provider_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_expense_providers`("id", "expense_id", "provider_id") SELECT "id", "expense_id", "provider_id" FROM `expense_providers`;--> statement-breakpoint
DROP TABLE `expense_providers`;--> statement-breakpoint
ALTER TABLE `__new_expense_providers` RENAME TO `expense_providers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;