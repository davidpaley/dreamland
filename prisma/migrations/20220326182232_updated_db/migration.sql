/*
  Warnings:

  - The `debit` column on the `AccountBalance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `credit` column on the `AccountBalance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `debit` column on the `DailyBalance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `credit` column on the `DailyBalance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `debit` column on the `JournalEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `credit` column on the `JournalEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `exchangeRate` to the `TokenTrasaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountBalance" DROP COLUMN "debit",
ADD COLUMN     "debit" MONEY NOT NULL DEFAULT 0,
DROP COLUMN "credit",
ADD COLUMN     "credit" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DailyBalance" DROP COLUMN "debit",
ADD COLUMN     "debit" MONEY NOT NULL DEFAULT 0,
DROP COLUMN "credit",
ADD COLUMN     "credit" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "debit",
ADD COLUMN     "debit" MONEY NOT NULL DEFAULT 0,
DROP COLUMN "credit",
ADD COLUMN     "credit" MONEY NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TokenTrasaction" DROP COLUMN "exchangeRate",
ADD COLUMN     "exchangeRate" MONEY NOT NULL;
