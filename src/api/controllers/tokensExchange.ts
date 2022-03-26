import { prisma } from "../..";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";
import {
  TOKEN_DAILY_MAX_AMOUNT,
  TOKEN_TRANSACTION_DESCRIPTION,
} from "../../constants/tokens";

import { Request, Response } from "express";
import { DailyBalance, Prisma, PrismaClient } from "@prisma/client";
import { getDailyBalanceId } from "../../utils/dates";
import {
  updateAllBalances,
  updateJournalEntriesAccounts,
} from "../../utils/database";

const exchangeTokens = async (
  userId: number,
  amountOfTokensToExchange: Prisma.Decimal
) => {
  //   const tokenLedgerId = LEDGER_IDS.token;
  const currentDate = new Date();
  const dailyId = getDailyBalanceId();
  await prisma.$transaction(async (prisma) => {
    const tokenTransaction = await prisma.tokenTrasaction.create({
      data: {
        userId,
        description: TOKEN_TRANSACTION_DESCRIPTION.tokensExchanged,
        date: currentDate,
      },
    });

    await updateJournalEntriesAccounts({
      ledgerId: LEDGER_IDS.token,
      userId,
      tokenTransactionId: tokenTransaction.id,
      date: currentDate,
      prisma,
      accountForDebit: ACCOUNT_IDS.tokensExchanged,
      accountForCredit: ACCOUNT_IDS.tokensInventory,
      amount: amountOfTokensToExchange,
    });
    await updateAllBalances({
      dailyId,
      ledgerId: LEDGER_IDS.token,
      userId,
      amount: amountOfTokensToExchange,
      accountForDebit: ACCOUNT_IDS.tokensExchanged,
      accountForCredit: ACCOUNT_IDS.tokensInventory,
      prisma,
    });
  });
};

export const tokensExchangeAPI = async (req: Request, res: Response) => {
  console.log("getting the users");
  const currentDate = new Date();
  const dailyId = getDailyBalanceId();
  const dailyBalanceOfUsersToUpdate: DailyBalance[] =
    await prisma.$queryRaw`select * from public."DailyBalance" where debit-credit > '0' and "accountId" = ${ACCOUNT_IDS.tokensInventory} and "dailyId" = ${dailyId};`;
  console.log({ dailyBalanceOfUsersToUpdate });
  if (!dailyBalanceOfUsersToUpdate?.length) {
    res.status(200).send({
      message: "No user to update",
    });
  }

  for (let dailyBalance of dailyBalanceOfUsersToUpdate) {
    // Prisma uses under the hood : decimal.js https://mikemcl.github.io/decimal.js/#sub

    const amountOfTokensToExchange =
      (dailyBalance.debit &&
        dailyBalance.credit &&
        dailyBalance.debit.minus(dailyBalance.credit)) ||
      new Prisma.Decimal(0);
    if (!amountOfTokensToExchange) {
      throw "The SQL query get a user to update with 0 in their daily balance";
    }
    exchangeTokens(dailyBalance.userId, amountOfTokensToExchange);
  }

  res.json({ status: "ok" });
};
