import { prisma } from "../..";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";
import {
  TOKEN_DAILY_MAX_AMOUNT,
  TOKEN_TRANSACTION_DESCRIPTION,
} from "../../constants/tokens";

import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { getDailyBalanceId } from "../../utils/dates";
import {
  updateAllBalances,
  addJournalEntriesRecords,
} from "../../utils/database";

export const tokensAssignationAPI = async (req: Request, res: Response) => {
  const { userId, tokenQuantity } = req.body;

  const amount = new Prisma.Decimal(tokenQuantity);
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
    // Prisma uses under the hood : decimal.js https://mikemcl.github.io/decimal.js/#sub
    tokenEarnedDailyBalance?.credit.add(amount) >
      new Prisma.Decimal(TOKEN_DAILY_MAX_AMOUNT)
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

      await addJournalEntriesRecords({
        ledgerId,
        userId,
        tokenTransactionId: tokenTransaction.id,
        date: currentDate,
        prisma,
        accountForDebit: ACCOUNT_IDS.tokensInventory,
        accountForCredit: ACCOUNT_IDS.tokensEarned,
        amount,
      });

      console.log("Journal entries updated");

      await updateAllBalances({
        dailyId,
        ledgerId,
        userId,
        amount,
        accountForDebit: ACCOUNT_IDS.tokensInventory,
        accountForCredit: ACCOUNT_IDS.tokensEarned,
        prisma,
      });

      console.log("Balances updated");
    });
    res.status(200).send({
      message: `The user ${userId} has received ${tokenQuantity} Dream tokens`,
    });
  } catch (e: unknown) {
    console.log(e);
    res.status(500).send({
      message: `Failed adding Tokens to the user ${userId}`,
    });
  }
};
