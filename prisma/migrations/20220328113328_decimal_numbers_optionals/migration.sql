-- AlterTable
ALTER TABLE "AccountBalance" ALTER COLUMN "debit" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DailyBalance" ALTER COLUMN "debit" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JournalEntry" ALTER COLUMN "debit" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TokenTrasaction" ALTER COLUMN "exchangeRate" DROP NOT NULL;