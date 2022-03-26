import { prisma } from "../..";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";
import {
  TOKEN_DAILY_MAX_AMOUNT,
  TOKEN_TRANSACTION_DESCRIPTION,
} from "../../constants/tokens";

import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { getDailyBalanceId } from "../../utils/dates";

const updateTotalBalance = async (
  ledgerId: string,
  userId: number,
  tokenQuantity: number,
  prisma: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >
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
      accountId: ACCOUNT_IDS.tokensEarned,
      credit: tokenQuantity,
    },
  });
};

const updateDailyBalance = async (
  dailyId: number,
  ledgerId: string,
  userId: number,
  tokenQuantity: number,
  prisma: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >
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
      accountId: ACCOUNT_IDS.tokensEarned,
      credit: tokenQuantity,
    },
  });
};

// app.post(`/token-assignation`, );

export const tokenInput = async (req: Request, res: Response) => {
  const { userId, tokenQuantity } = req.body;
  console.log({ userId, tokenQuantity });
  if (!userId || !tokenQuantity) {
    res.status(400).send({
      message: "You need to set the userId and the tokenQuantity",
    });
    return;
  }

  const ledgerId = LEDGER_IDS.token;
  const currentDate = new Date();
  const dailyId = getDailyBalanceId();

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
    tokenEarnedDailyBalance?.credit + tokenQuantity >= TOKEN_DAILY_MAX_AMOUNT
  ) {
    res.status(200).send({
      message: "User exceed the number of tokens per day",
    });
    return;
  }

  console.log("Token earned balance checked");
  // TODO: Add Prisma transactions
  // https://www.prisma.io/docs/concepts/components/prisma-client/transactions
  try {
    await prisma.$transaction(async (prisma) => {
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

      console.log("Journal entries updated");

      await updateDailyBalance(
        dailyId,
        ledgerId,
        userId,
        tokenQuantity,
        prisma
      );
      await updateTotalBalance(ledgerId, userId, tokenQuantity, prisma);

      console.log("Balances updated");
    });
    res.status(200).send({
      message: `The user ${userId} has received ${tokenQuantity} Dream tokens`,
    });
  } catch (e: unknown) {
    console.log(e);
    res.status(500).send({
      message: "Failed adding Tokens to the user",
    });
  }
};
