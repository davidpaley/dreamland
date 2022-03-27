import { Prisma } from "@prisma/client";

const HARDCODED_TOKEN_EXCHANGE = 0.15;

// TODO: Resolve mock function
export const getExchangePrice = () =>
  new Prisma.Decimal(HARDCODED_TOKEN_EXCHANGE);
