/*
  Warnings:

  - Added the required column `capacidad` to the `mesa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mesa` ADD COLUMN `capacidad` INTEGER NOT NULL;
