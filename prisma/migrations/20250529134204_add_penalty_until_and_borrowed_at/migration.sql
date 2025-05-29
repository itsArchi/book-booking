/*
  Warnings:

  - You are about to alter the column `borrowedAt` on the `book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `penaltyUntil` on the `member` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `borrowedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `member` MODIFY `penaltyUntil` DATETIME NULL;
