/*
  Warnings:

  - You are about to alter the column `debit` on the `AccountBalance` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `credit` on the `AccountBalance` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `debit` on the `DailyBalance` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `credit` on the `DailyBalance` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `debit` on the `JournalEntry` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `credit` on the `JournalEntry` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - You are about to alter the column `exchangeRate` on the `TokenTrasaction` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.
  - Made the column `debit` on table `AccountBalance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `credit` on table `AccountBalance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `debit` on table `DailyBalance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `credit` on table `DailyBalance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `debit` on table `JournalEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `credit` on table `JournalEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exchangeRate` on table `TokenTrasaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AccountBalance" ALTER COLUMN "debit" SET NOT NULL,
ALTER COLUMN "debit" SET DATA TYPE DECIMAL,
ALTER COLUMN "credit" SET NOT NULL,
ALTER COLUMN "credit" SET DATA TYPE DECIMAL;

-- AlterTable
ALTER TABLE "DailyBalance" ALTER COLUMN "debit" SET NOT NULL,
ALTER COLUMN "debit" SET DATA TYPE DECIMAL,
ALTER COLUMN "credit" SET NOT NULL,
ALTER COLUMN "credit" SET DATA TYPE DECIMAL;

-- AlterTable
ALTER TABLE "JournalEntry" ALTER COLUMN "debit" SET NOT NULL,
ALTER COLUMN "debit" SET DATA TYPE DECIMAL,
ALTER COLUMN "credit" SET NOT NULL,
ALTER COLUMN "credit" SET DATA TYPE DECIMAL;

-- AlterTable
ALTER TABLE "TokenTrasaction" ALTER COLUMN "exchangeRate" SET NOT NULL,
ALTER COLUMN "exchangeRate" SET DATA TYPE DECIMAL;
