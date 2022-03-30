# Description

Node API to keep track of double-entry accounting ledgers for USD and DREAM tokens

# Getting started

## 1. Clone the project and install dependencies

Clone this repository:

```
git clone git@github.com:davidpaley/dreamland.git
```

Install npm dependencies:

```
cd dreamland
npm install
```

## 2. Set the Database URL and create and seed the database

- Create `.env` file with

```
DB_URL=postgres://[postgresUser]:[postgresPassword]@[urlConnection]/[database]
```

Run the following command to create your database file.

```
npx prisma migrate dev
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

## 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`.

# Using the REST API

## Postman Collection

You could import in postman [this file](dreamland.postman_collection.json) `dreamland.postman_collection.json` and interact with the API.

## Endpoints

### `GET`

- `/api/token-history-for-today?userId={id}`: get the token history for today by it's user `id`
- `/api/usd-history-for-today?userId={id}`: Fetch USD history by it's user `id`
- `/api/stats?userId={id}`: Get the amount of token a user won today and the amount of USD that he/she has in their account by it's user `id`.

### `POST`

- `api/tokens-exchange`: Execute the exchange of all the tokens that the users have by USDs.
- `api/tokens-assignation`: Set an amount of tokens to a specific user
  - Body:
    - `userId: number` (required): The user ID
    - `tokenQuantity: Decimal` (required): The amount of tokens

# DATABASE

## Design

<img src="./prisma/ERD.svg">

## How the Database populate itself

Find information [here](docs/database-population.md).

## Data types for ledger amounts

Please, check [data-types](docs/data-types.md) file.

# Infrastructure

Please, review [this document](docs/infrastructure.md)

# Edge cases

Please, check [this document](docs/edge-cases.md)

# Technical Debt

- Add automated tests.
  - Ideally 80% coverage
  - The main thing to do would be to add integration tests for the exchange token and token assignation endpoints.
- Create a cron service with [Node Cron](https://www.npmjs.com/package/node-cron) to execute the USD exchange automatically every day at the end of every hour.
- Error tracking and actual logger (instead of console log). For doing this, I would use [Sentry](https://sentry.io/)
- Use access tokens to access this API.
- Check [edge cases file](docs/edge-cases.md) and how I would avoid them.
