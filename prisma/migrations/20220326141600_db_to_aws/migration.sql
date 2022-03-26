-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTrasaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "exchangeRate" DOUBLE PRECISION,

    CONSTRAINT "TokenTrasaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" SERIAL NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenTransactionId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountBalance" (
    "id" SERIAL NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "AccountBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyBalance" (
    "dailyId" INTEGER NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_description_key" ON "Ledger"("description");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AccountBalance_ledgerId_userId_accountId_key" ON "AccountBalance"("ledgerId", "userId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBalance_dailyId_ledgerId_userId_accountId_key" ON "DailyBalance"("dailyId", "ledgerId", "userId", "accountId");

-- AddForeignKey
ALTER TABLE "TokenTrasaction" ADD CONSTRAINT "TokenTrasaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_tokenTransactionId_fkey" FOREIGN KEY ("tokenTransactionId") REFERENCES "TokenTrasaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalance" ADD CONSTRAINT "DailyBalance_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalance" ADD CONSTRAINT "DailyBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalance" ADD CONSTRAINT "DailyBalance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
