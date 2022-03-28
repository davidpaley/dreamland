import { Router } from "express";
import { tokensAssignationAPI as tokensAssignationAPI } from "../controllers/tokensAssignation";

import bodyParser from "body-parser";
import { tokensExchangeAPI } from "../controllers/tokensExchange";
import { statsAPI } from "../controllers/stats";
import { tokenHistoryForToday, usdHistory } from "../controllers/history";

var jsonParser = bodyParser.json();

const routes = Router();

routes.post("/tokens-assignation", jsonParser, tokensAssignationAPI);
routes.post("/tokens-exchange", jsonParser, tokensExchangeAPI);
routes.get("/stats", statsAPI);
routes.get("/token-history-for-today", tokenHistoryForToday);
routes.get("/usd-history-for-today", usdHistory);

export default routes;
