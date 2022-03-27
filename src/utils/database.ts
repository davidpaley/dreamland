import { Prisma, PrismaClient } from "@prisma/client";

type AddJournalEntry = {
  ledgerId: string;
  userId: number;
  tokenTransactionId: number;
  date: Date;
  prisma: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >;
  accountForDebit: string;
  accountForCredit: string;
  amount: Prisma.Decimal;
};

export const addJournalEntriesRecords = async ({
  ledgerId,
  userId,
  tokenTransactionId,
  date,
  prisma,
  accountForDebit,
  accountForCredit,
  amount,
}: AddJournalEntry) => {
  const journalEntryRecord = {
    ledgerId,
    userId,
    tokenTransactionId,
    date,
  };
  await prisma.journalEntry.createMany({
    data: [
      {
        ...journalEntryRecord,
        accountId: accountForDebit,
        debit: amount,
      },
      {
        ...journalEntryRecord,
        accountId: accountForCredit,
        credit: amount,
      },
    ],
  });
};

type UpdateDailyBalance = {
  dailyId: number;
  ledgerId: string;
  userId: number;
  amount: Prisma.Decimal;
  accountForDebit?: string;
  accountForCredit?: string;
  prisma: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >;
};
export const updateDailyBalance = async ({
  dailyId,
  ledgerId,
  userId,
  amount,
  accountForDebit,
  accountForCredit,
  prisma,
}: UpdateDailyBalance) => {
  if (accountForDebit) {
    await prisma.dailyBalance.upsert({
      where: {
        dailyId_ledgerId_userId_accountId: {
          dailyId,
          ledgerId,
          userId,
          accountId: accountForDebit,
        },
      },
      update: {
        debit: {
          increment: amount,
        },
      },
      create: {
        dailyId,
        ledgerId,
        userId,
        accountId: accountForDebit,
        debit: amount,
      },
    });
  }
  if (accountForCredit) {
    await prisma.dailyBalance.upsert({
      where: {
        dailyId_ledgerId_userId_accountId: {
          dailyId,
          ledgerId,
          userId,
          accountId: accountForCredit,
        },
      },
      update: {
        credit: {
          increment: amount,
        },
      },
      create: {
        dailyId,
        ledgerId,
        userId,
        accountId: accountForCredit,
        credit: amount,
      },
    });
  }
};

export const updateTotalBalance = async ({
  ledgerId,
  userId,
  amount,
  accountForDebit,
  accountForCredit,
  prisma,
}: Omit<UpdateDailyBalance, "dailyId">) => {
  if (accountForDebit) {
    await prisma.accountBalance.upsert({
      where: {
        ledgerId_userId_accountId: {
          ledgerId,
          userId,
          accountId: accountForDebit,
        },
      },
      update: {
        debit: {
          increment: amount,
        },
      },
      create: {
        ledgerId,
        userId,
        accountId: accountForDebit,
        debit: amount,
      },
    });
  }
  if (accountForCredit) {
    await prisma.accountBalance.upsert({
      where: {
        ledgerId_userId_accountId: {
          ledgerId,
          userId,
          accountId: accountForCredit,
        },
      },
      update: {
        credit: {
          increment: amount,
        },
      },
      create: {
        ledgerId,
        userId,
        accountId: accountForCredit,
        credit: amount,
      },
    });
  }
};

export const updateAllBalances = async ({
  dailyId,
  ledgerId,
  userId,
  amount,
  accountForDebit,
  accountForCredit,
  prisma,
}: UpdateDailyBalance) => {
  await updateDailyBalance({
    dailyId,
    ledgerId,
    userId,
    amount,
    accountForDebit,
    accountForCredit,
    prisma,
  });
  await updateTotalBalance({
    ledgerId,
    userId,
    amount,
    accountForDebit,
    accountForCredit,
    prisma,
  });
};
