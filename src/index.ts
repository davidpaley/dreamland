import { PrismaClient } from "@prisma/client";
import express from "express";
import routes from "./api/routes/routes";

export const prisma = new PrismaClient();
export const app = express();

app.use(express.json());

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`)
);
app.use("/api", routes);
