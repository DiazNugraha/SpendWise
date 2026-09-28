ALTER TABLE `expense_providers` RENAME COLUMN "provider_id" TO "user_provider_id";--> statement-breakpoint
ALTER TABLE `user_providers` ADD `description` text;--> statement-breakpoint
ALTER TABLE `user_providers` DROP COLUMN `provider_id`;