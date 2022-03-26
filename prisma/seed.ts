import { PrismaClient, Prisma } from "@prisma/client";
import { ACCOUNT_IDS, LEDGER_IDS } from "../src/constants/dataBase";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "David",
    email: "david.paleyy@gmail.com",
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
  },
  {
    name: "Cristian",
    email: "cristian.campos@gmail.com",
  },
];

const ledgerData: Prisma.LedgerCreateInput[] = [
  {
    id: LEDGER_IDS.usd,
    description: "USD Ledger",
  },
  {
    id: LEDGER_IDS.token,
    description: "TOKEN Ledger",
  },
];

const accountData: Prisma.AccountCreateInput[] = [
  {
    id: ACCOUNT_IDS.tokensInventory,
    type: "ASSET",
    description: "Represents Tokens inventory for an user",
  },
  {
    id: ACCOUNT_IDS.tokensEarned,
    type: "INCOME",
    description: "Represents the income of tokens",
  },
  {
    id: ACCOUNT_IDS.tokensExchanged,
    type: "EXPENSE",
    description: "Represents the Tokens exchanged by money",
  },
  {
    id: ACCOUNT_IDS.usdInventory,
    type: "ASSET",
    description: "Represents USDs inventory for an user",
  },
  {
    id: ACCOUNT_IDS.usdEarned,
    type: "INCOME",
    description: "Represents the income of USD",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const l of ledgerData) {
    const ledger = await prisma.ledger.create({
      data: l,
    });
    console.log(`Created ledger with id: ${ledger.id}`);
  }

  for (const a of accountData) {
    const account = await prisma.account.create({
      data: a,
    });
    console.log(`Created account with id: ${account.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
