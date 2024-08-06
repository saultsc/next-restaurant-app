/*
  Warnings:

  - You are about to alter the column `estado` on the `mesa` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `mesa` MODIFY `estado` ENUM('reservada', 'ocupada', 'disponible') NOT NULL DEFAULT 'disponible';
