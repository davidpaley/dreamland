import { prisma } from "../..";
import { Request, Response } from "express";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";

export const tokenHistoryForToday = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tokenEarnedThisDayRecord = await prisma.journalEntry.findMany({
    where: {
      userId,
      ledgerId: LEDGER_IDS.token,
      accountId: ACCOUNT_IDS.tokensEarned,
      date: {
        gte: today,
      },
    },
  });

  if (!tokenEarnedThisDayRecord?.length) {
    res.status(200).send({
      message: `No token transactions for today for the user ${userId}`,
    });
    return;
  }

  const tokenTransactionsHistory = tokenEarnedThisDayRecord.map(
    (transaction) => ({
      time: transaction.date,
      amount: transaction.credit,
    })
  );
  console.log({ tokenTransactionsHistory });

  res.json({ data: tokenTransactionsHistory });
};

export const usdHistory = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  const usdEarnedThisDayRecord = await prisma.journalEntry.findMany({
    where: {
      userId,
      ledgerId: LEDGER_IDS.usd,
      accountId: ACCOUNT_IDS.usdEarned,
      date: {
        lt: today,
      },
    },
  });
  if (!usdEarnedThisDayRecord?.length) {
    res.status(200).send({
      message: `No USD transactions for today for the user ${userId}`,
    });
    return;
  }
  const usdTransactionsHistory = usdEarnedThisDayRecord.map((transaction) => ({
    time: transaction.date,
    amount: transaction.credit,
  }));
  res.json({ data: usdTransactionsHistory });
};
