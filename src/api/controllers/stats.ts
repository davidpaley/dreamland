import { prisma } from "../..";
import { Request, Response } from "express";
import { getDailyBalanceId } from "../../utils/dates";
import { ACCOUNT_IDS, LEDGER_IDS } from "../../constants/dataBase";

export const statsAPI = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const dailyId = getDailyBalanceId();
  const tokenEarnedThisDayRecord = await prisma.dailyBalance.findUnique({
    where: {
      dailyId_ledgerId_userId_accountId: {
        dailyId,
        ledgerId: LEDGER_IDS.token,
        userId,
        accountId: ACCOUNT_IDS.tokensEarned,
      },
    },
  });

  const usdAmountRecord = await prisma.accountBalance.findUnique({
    where: {
      ledgerId_userId_accountId: {
        ledgerId: LEDGER_IDS.usd,
        userId,
        accountId: ACCOUNT_IDS.usdInventory,
      },
    },
  });
  res.json({
    data: {
      tokensWonOnCurrentDay: tokenEarnedThisDayRecord?.credit || 0,
      totalUsdInAccount: usdAmountRecord
        ? usdAmountRecord?.debit?.minus(usdAmountRecord?.credit || 0)
        : 0,
    },
  });
};
