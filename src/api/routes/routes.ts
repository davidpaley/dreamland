import { Router } from "express";
import { tokensAssignationAPI as tokensAssignationAPI } from "../controllers/tokensAssignation";

import bodyParser from "body-parser";
import { tokensExchangeAPI } from "../controllers/tokensExchange";
import { statsAPI } from "../controllers/stats";
import { tokenHistoryForToday, usdHistory } from "../controllers/history";

var jsonParser = bodyParser.json();

const routes = Router();

routes.post("/v1/user/:id/assignation", jsonParser, tokensAssignationAPI);
routes.post("/v1/exchange", jsonParser, tokensExchangeAPI);
routes.get("/v1/user/:id/history", tokenHistoryForToday);
routes.get("/v1/user/:id/stats", statsAPI);
routes.get("/v1/user/:id/usd", usdHistory);

export default routes;
