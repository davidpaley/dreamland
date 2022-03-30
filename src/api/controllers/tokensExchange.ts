import { prisma } from "../..";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";
import { TOKEN_TRANSACTION_DESCRIPTION } from "../../constants/tokens";

import { Request, Response } from "express";
import { DailyBalance, Prisma, TokenTrasaction } from "@prisma/client";
import { getDailyBalanceId } from "../../utils/dates";
import {
  updateAllBalances,
  addJournalEntriesRecords,
} from "../../utils/database";
import { getExchangePrice } from "../external/exchange";

const exchangeTokens = async (
  userId: number,
  amountOfTokensToExchange: Prisma.Decimal
) => {
  const currentDate = new Date();
  const dailyId = getDailyBalanceId();

  await prisma.$transaction(
    async (prisma) => {
      const exchangeRate: Prisma.Decimal = await getExchangePrice();
      const tokenTransaction = await prisma.tokenTrasaction.create({
        data: {
          userId,
          description: TOKEN_TRANSACTION_DESCRIPTION.tokensExchanged,
          date: currentDate,
          exchangeRate,
        },
      });
      console.log("token transaction table updated");
      // Update Token Ledger
      await addJournalEntriesRecords({
        ledgerId: LEDGER_IDS.token,
        userId,
        tokenTransactionId: tokenTransaction.id,
        date: currentDate,
        prisma,
        accountForDebit: ACCOUNT_IDS.tokensExchanged,
        accountForCredit: ACCOUNT_IDS.tokensInventory,
        amount: amountOfTokensToExchange,
      });
      console.log("Journal entries for Token Ledger updated");

      const amount = amountOfTokensToExchange.times(exchangeRate);
      // Update USD Ledger
      await addJournalEntriesRecords({
        ledgerId: LEDGER_IDS.usd,
        userId,
        tokenTransactionId: tokenTransaction.id,
        date: currentDate,
        accountForDebit: ACCOUNT_IDS.usdInventory,
        accountForCredit: ACCOUNT_IDS.usdEarned,
        amount,
        prisma,
      });
      console.log("Journal entries updated for USD Ledger");

      await updateAllBalances({
        dailyId,
        ledgerId: LEDGER_IDS.token,
        userId,
        amount: amountOfTokensToExchange,
        accountForDebit: ACCOUNT_IDS.tokensExchanged,
        accountForCredit: ACCOUNT_IDS.tokensInventory,
        prisma,
      });
      console.log("Balances updated for Token Ledger");
      await updateAllBalances({
        dailyId,
        ledgerId: LEDGER_IDS.usd,
        userId,
        accountForDebit: ACCOUNT_IDS.usdInventory,
        accountForCredit: ACCOUNT_IDS.usdEarned,
        amount,
        prisma,
      });

      console.log("Balances updated for USD Ledger");
    },
    {
      timeout: 50000,
    }
  );
};

export const tokensExchangeAPI = async (req: Request, res: Response) => {
  console.log("Processing tokens exchange");
  console.log("getting the users");
  const dailyId = getDailyBalanceId();

  // I had to use rawQuery because Prisma do not allow me to subtract the variables in the where, https://github.com/prisma/prisma/issues/5048
  // One possible solution would be to add a field balance (with the result of the operation) in the dailyBalaceAccount table
  const dailyBalanceOfUsersToUpdate: DailyBalance[] =
    await prisma.$queryRaw`select * from public."DailyBalance" where debit-credit > '0' and "accountId" = ${ACCOUNT_IDS.tokensInventory} and "dailyId" = ${dailyId};`;

  if (!dailyBalanceOfUsersToUpdate?.length) {
    res.status(200).send({
      message: "No user to update",
    });
  }
  let usersWithErrorsCounter = 0;
  for (let dailyBalance of dailyBalanceOfUsersToUpdate) {
    const { debit, credit, userId } = dailyBalance;

    // Error from Prisma, with raw queries it returns type number instead of Decimal.
    console.log({ debitType: typeof debit }); // this is number

    const amountOfTokensToExchange =
      // The problem with the Prisma rawQuery is that it doesn't return the correct type for the debit and credit (it returns numbers as type)
      new Prisma.Decimal(debit || 0).minus(new Prisma.Decimal(credit || 0)) ||
      new Prisma.Decimal(0);

    if (!amountOfTokensToExchange) {
      throw "The SQL query get a user to update with 0 in their daily balance";
    }
    try {
      console.log(
        `exchange for user ${userId} with the amount ${amountOfTokensToExchange} of tokens`
      );
      // There could be problems with concurret transactions in Prisma right now
      // For now, I would let this sync
      // issue: https://github.com/prisma/prisma/issues/11750
      await exchangeTokens(userId, amountOfTokensToExchange);
    } catch (e: unknown) {
      console.log(
        `Error for user ${userId} exchanging the amount of tokens ${amountOfTokensToExchange}`
      );
      console.log(e);
      usersWithErrorsCounter++;
    }
  }
  if (dailyBalanceOfUsersToUpdate.length === usersWithErrorsCounter) {
    res.status(500).send({
      message:
        "Error making the tokens exchanges. There was an error for every user. Please check the logs or communicate with admin",
    });
    return;
  }
  if (usersWithErrorsCounter) {
    res.status(200).send({
      message:
        "There were errors updating some of the users. Please check the logs or communicate with admin",
    });
    return;
  }
  res.status(200).send({
    message: "All tokens exchanged!",
  });
};
