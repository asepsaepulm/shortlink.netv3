-- AlterTable
ALTER TABLE `links` ADD COLUMN `short_url` TEXT NULL,
    ADD COLUMN `slug` VARCHAR(255) NULL;
