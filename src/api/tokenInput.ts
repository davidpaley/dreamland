import { app, prisma } from "..";
import { ACCOUNT_IDS, LEDGER_IDS } from "../constants/dataBase";
import {
  TOKEN_DAILY_MAX_AMOUNT,
  TOKEN_TRANSACTION_DESCRIPTION,
} from "../constants/tokens";

const updateTotalBalance = async (
  ledgerId: string,
  userId: number,
  tokenQuantity: number
) => {
  // update tokens inventory (asset) account
  await prisma.accountBalance.upsert({
    where: {
      ledgerId_userId_accountId: {
        ledgerId,
        userId,
        accountId: ACCOUNT_IDS.tokensInventory,
      },
    },
    update: {
      debit: {
        increment: tokenQuantity,
      },
    },
    create: {
      ledgerId,
      userId,
      accountId: ACCOUNT_IDS.tokensInventory,
      debit: tokenQuantity,
    },
  });
  // update tokens earned (income) account
  await prisma.accountBalance.upsert({
    where: {
      ledgerId_userId_accountId: {
        ledgerId,
        userId,
        accountId: ACCOUNT_IDS.tokensEarned,
      },
    },
    update: {
      credit: {
        increment: tokenQuantity,
      },
    },
    create: {
      ledgerId,
      userId,
      accountId: ACCOUNT_IDS.tokensInventory,
      credit: tokenQuantity,
    },
  });
};

const updateDailyBalance = async (
  dailyId: number,
  ledgerId: string,
  userId: number,
  tokenQuantity: number
) => {
  // update tokens inventory (asset) account
  await prisma.dailyBalance.upsert({
    where: {
      dailyId_ledgerId_userId_accountId: {
        dailyId,
        ledgerId,
        userId,
        accountId: ACCOUNT_IDS.tokensInventory,
      },
    },
    update: {
      debit: {
        increment: tokenQuantity,
      },
    },
    create: {
      dailyId,
      ledgerId,
      userId,
      accountId: ACCOUNT_IDS.tokensInventory,
      debit: tokenQuantity,
    },
  });
  // update tokens earned (income) account
  await prisma.dailyBalance.upsert({
    where: {
      dailyId_ledgerId_userId_accountId: {
        dailyId,
        ledgerId,
        userId,
        accountId: ACCOUNT_IDS.tokensEarned,
      },
    },
    update: {
      credit: {
        increment: tokenQuantity,
      },
    },
    create: {
      dailyId,
      ledgerId,
      userId,
      accountId: ACCOUNT_IDS.tokensInventory,
      credit: tokenQuantity,
    },
  });
};

app.post(`/token-assignation`, async (req, res) => {
  const { userId, tokenQuantity } = req.body;
  const ledgerId = LEDGER_IDS.token;
  const currentDate = new Date();
  const dailyId = parseInt(
    `${currentDate.getDate()}${currentDate.getMonth}${currentDate.getFullYear}`
  );
  const tokenEarnedDailyBalance = await prisma.dailyBalance.findUnique({
    where: {
      dailyId_ledgerId_userId_accountId: {
        dailyId,
        ledgerId,
        userId,
        accountId: ACCOUNT_IDS.tokensEarned,
      },
    },
  });
  if (
    tokenEarnedDailyBalance?.credit &&
    tokenEarnedDailyBalance?.credit >= TOKEN_DAILY_MAX_AMOUNT
  ) {
    res.status(200).send({
      message: "User exceed the number of tokens per day",
    });
    return;
  }
  // Prisma transactions https://www.prisma.io/docs/concepts/components/prisma-client/transactions

  const tokenTransaction = await prisma.tokenTrasaction.create({
    data: {
      userId,
      description: TOKEN_TRANSACTION_DESCRIPTION.tokensEarned,
      date: currentDate,
    },
  });
  // update journalEntry
  const journalEntryRecord = {
    ledgerId,
    userId,
    tokenTransactionId: tokenTransaction.id,
    date: currentDate,
  };
  await prisma.journalEntry.createMany({
    data: [
      {
        ...journalEntryRecord,
        accountId: ACCOUNT_IDS.tokensInventory,
        debit: tokenQuantity,
      },
      {
        ...journalEntryRecord,
        accountId: ACCOUNT_IDS.tokensEarned,
        credit: tokenQuantity,
      },
    ],
  });

  await updateDailyBalance(dailyId, ledgerId, userId, tokenQuantity);
  await updateTotalBalance(ledgerId, userId, tokenQuantity);

  res.status(200).send({
    message: `The user ${userId} has received ${tokenQuantity} Dream tokens`,
  });
});
