/*
  Warnings:

  - Made the column `x` on table `PontoInteresse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `y` on table `PontoInteresse` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PontoInteresse" ALTER COLUMN "x" SET NOT NULL,
ALTER COLUMN "x" SET DEFAULT 50,
ALTER COLUMN "y" SET NOT NULL,
ALTER COLUMN "y" SET DEFAULT 50;
