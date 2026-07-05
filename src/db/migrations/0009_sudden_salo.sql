ALTER TABLE `providers` ADD `identifier` text NOT NULL;--> statement-breakpoint
ALTER TABLE `providers` ADD `logo` text;--> statement-breakpoint
CREATE UNIQUE INDEX `providers_identifier_unique` ON `providers` (`identifier`);