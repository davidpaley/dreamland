# Edge Cases

## Transactions

All the DB transactions are inside the [Prisma Transaction](https://www.prisma.io/docs/concepts/components/prisma-client/transactions). So if any of the requests fails, it would not make the whole transaction. What I would like to have is notifications when it fails, that this specific user, has this specific problem. Also I would log that (using Sentry).

### Rollback for transactions that were completed

I could create an endpoint/function to invalidate a whole transaction (in the tables JournalEntry and TokenTrasaction) in case it is necessary. We could have a column of isInvalidate (default `false`) for the different tables, and this, in the case of JournalEntry and TokenTrasaction, would be the only column that could be updated. I could use this endpoint/function every time I need to invalidate a transaction. This process could update the values in the balance tables, calculating again this with what we have in the JournalEntry table.

Also, I would create a cron process that check that the data on JournalEntry table is ok with the data in the Balance tables (daily and account balance). If it is not ok, it would make notifications and update the balances with the data of JournalEntry table.

## Error with the exchange rate API

One possible problem is that the API that gets the echange rate to convert a token amount to USD do not work. In that case, all the process of tokens exchange should stop, wait some seconds and try again until all the tokens are converted correctly

## Access to sencible data

We will have to be careful about what data of the database can be access by a manager and what data can't. We should take into account this, and make sure how we are going to handle the permissions of different types of data inside our database.

Also we should take into account possible hacking, use best practices to avoid this in order to not expose our data. Some of the points to take into account here are:

- Use access tokens to access the API
- Use data encryption
- Set limits on how often the API can be called and throttling connections, so we can protect it from traffic spikes and DDoS attacks.
- Try to identify vulnerabilities and work around that

## Read Replicas inconsistency

If we are going to implement read replicas (check [infrastructure documentation](infrastructure.md)), to make our queries faster, we have to take into account that some of them could have some delay to have the last updated data. We should be careful with transactional data around this, we could have some inconsistencies. We should use read replicas only for get historical (check [history controler](../src/api/controllers/history.ts)) and stats (check [stats controler](../src/api/controllers/stats.ts)) data, we shouldn't use it for sencible data, for example, get the balances to make the tokens exchange.
