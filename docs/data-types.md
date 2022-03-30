## Data types for ledger amounts

As you can check [here](https://prismadb.readthedocs.io/en/latest/data-types/) and [here](https://www.prisma.io/dataguide/postgresql/introduction-to-data-types#numbers-and-numeric-values) to have a better precision for a number with decimals in Postgres, the best type to use is DECIMAL/NUMERIC (numeric and decimal is the same for Postgres, check [this](https://stackoverflow.com/questions/33730538/difference-between-decimal-and-numeric-datatype-in-psql)).

I implement this with Prisma, so in the code I have the type `Prisma.Decimal` that under the hood use `decimal.js`

### Problems with Prisma

You can find this problem in the file `src/api/controllers/tokensExchange.ts`, line 109.

I had a problem when I tried to get all the records from the daily balance account, that has a balance greater than zero for an specific account. I can't do this with a prisma normal request (with prisma client), so I have to use a [raw query](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access).

The problem with the Prisma raw query is that it is returning the wrong type for the amount in the records (it returns credit and debit as `number` and not `Prisma.Decimal`, the correct type). This is an error from Prisma. I have to convert it manually. It doesn't seems to affect so much, but I know it is not the best.

To avoid this problem I could calculate the balance when I save the record and create another column for balance, so having that, I could retrieve the daily balance with the prisma client as:

```
const dailyBalanceOfUsersToUpdate = await prisma.dailyBalance.findMany({
    where: {
      accountId,
      dailyId,
      balance: {
        gte: 0,
      },
    },
  });
```

With this I could retrieve the records with the values in the correct type.

I wanted to leave this, so I can show the problem.
