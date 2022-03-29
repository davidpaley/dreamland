# Description

Node API to keep track of double-entry accounting ledgers for USD and DREAM token

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

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

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

You could import in postman the file `dreamland.postman_collection.json` and interact with the API.

## Endpoints

### `GET`

- `/api/token-history-for-today?userId={id}`: get the token history for today by it's user `id`
- `/api/usd-history-for-today?userId={id}`: Fetch USD history by it's user `id`
- `/api/stats?userId={id}`: Get the amount of token a user won today and the amount of USD that he/she has in their account by it's user `id`.

### `POST`

- `api/tokens-exchange`: Execute the exchange of all the tokens that the users has by USDs.
- `api/tokens-assignation`: Set an amount of tokens to a specific user
  - Body:
    - `userId: number` (required): The user ID
    - `tokenQuantity: Decimal` (required): The amount of tokens
    - `specificHour: String` (optional): Hour of the current day when you want the token assignation. If this is undefined, it will set the current time.
    - `specificMinute: String` (optional): Minute of the current day when you want the token assignation. The hour should be defined to apply this. If the hour is defined and this is undefined, it will be set to zero.

# DATABASE

## Design

<img src="./prisma/ERD.svg">

## How the Database populate itself

Find information [here](docs/database-population.md).
