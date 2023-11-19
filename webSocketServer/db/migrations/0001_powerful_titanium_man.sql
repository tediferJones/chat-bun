CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);