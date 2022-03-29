# Database Population

## Accounts

Every ledger has different accounts

### Tokens Ledger Accounts

- "TOKENS_INVENTORY": Asset. Represents Tokens inventory for a user
- "TOKENS_EARNED": Income. Represents the income of tokens
- "TOKENS_EXCHANGED": Expense. Represents the Tokens that where converted to USD

### USD Ledger Accounts

- "USD_INVENTORY": Asset. Represents USD inventory for a user
- "USD_EARNED": Income. Represents the income of USD

## Tables for Balances

### Daily Balance table

I created this table to have one record per account for a user in a Ledger per day. It has a daily_id that is `[day][month][year]`. The combination of the columns dailyId, ledgerId, userId and accountId is unique for the records.

I could save the accum amount of every account on every record of the JournalEntry table, but I wanted to avoid making so much reads on this table, as it is the table that will have the greater amounts of records.

### Account Balance table

This table have one record for every account, with the totals.

## Population Process

### Input of Tokens

Endpoint GET `api/tokens-assignation`

1. Check amount of tokens by day wiht the DailyBalance table, check the total daily of the account TOKENS_EARNED in credit.
2. Add record in TokenTrasaction table if the amount is ok
3. Update TOKEN_INVENTORY (record for debit) and TOKEN_EARNED (another record for credit) in JournalEntry table.
4. Update TOKEN_INVENTORY (record for debit) and TOKEN_EARNED (another record for credit) in the DailyBalance and the Account Balance table.

### Process that validate every hour that all of those tokens are converted to dollars

Endpoint GET `api/tokens-exchange`

- Get all the users that made transactions that day and in the table DailyBalance, the `debit - credit` is not zero

#### For every user

1. Check DailyAccountBalance, the account TOKEN_INVENTORY with the daily ID and get the amount `debit - credit`
2. Update the table TokenTransaction with the new exchange
3. Update JournalEntries table with the 2 records for the Token Ledger

- Add record with TOKENS_EXCHANGED, debit (with the amount of tokens to exchange)
- Add record with TOKEN_INVENTORY, credit, with the same amount

4. Update daily balance table and account balance table with the totals (the records for TOKENS_EXCHANGED and TOKEN_INVENTORY)
5. Update JournalEntries table for USD Ledger

- Add record with USD_INVENTORY, debit (with the amount of tokens times the exchange rate of that moment)
- Add record with USD_EARNED, credit, with the same value

6. Update DailyBalance table and AccountBalance for USD (the records for USD_INVENTORY and USD_EARNED)
