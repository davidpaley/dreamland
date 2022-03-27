import { prisma } from "../..";
import { Request, Response } from "express";
import { getDailyBalanceId } from "../../utils/dates";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";

export const statsAPI = async (req: Request, res: Response) => {
  const { userId } = req.query;

  const user = parseInt(userId as string);
  const dailyId = getDailyBalanceId();
  const tokenEarnedThisDayRecord = await prisma.dailyBalance.findUnique({
    where: {
      dailyId_ledgerId_userId_accountId: {
        dailyId,
        ledgerId: LEDGER_IDS.token,
        userId: user,
        accountId: ACCOUNT_IDS.tokensEarned,
      },
    },
  });

  const usdAmountRecord = await prisma.accountBalance.findUnique({
    where: {
      ledgerId_userId_accountId: {
        ledgerId: LEDGER_IDS.usd,
        userId: user,
        accountId: ACCOUNT_IDS.usdInventory,
      },
    },
  });
  res.json({
    tokensWonOnCurrentDay: tokenEarnedThisDayRecord?.credit || 0,
    totalUsdInAccount: usdAmountRecord?.debit?.minus(
      usdAmountRecord?.credit || 0
    ),
  });
};
