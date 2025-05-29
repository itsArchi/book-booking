/*
  Warnings:

  - The primary key for the `book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `book` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Book_code_key` ON `book`;

-- AlterTable
ALTER TABLE `book` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `borrowedAt` DATETIME NULL,
    ALTER COLUMN `isBorrowed` DROP DEFAULT,
    ADD PRIMARY KEY (`code`);

-- AlterTable
ALTER TABLE `member` ADD COLUMN `penaltyUntil` DATETIME NULL;
