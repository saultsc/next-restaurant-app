/*
  Warnings:

  - You are about to drop the column `telefonno` on the `cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `telefonno`,
    ADD COLUMN `telefonno` VARCHAR(191) NULL;
