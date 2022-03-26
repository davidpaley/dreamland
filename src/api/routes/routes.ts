import { Router } from "express";
import { tokensAssignationAPI as tokensAssignationAPI } from "../controllers/tokensAssignation";

import bodyParser from "body-parser";
import { tokensExchangeAPI } from "../controllers/tokensExchange";

var jsonParser = bodyParser.json();

const routes = Router();

routes.post("/tokens-assignation", jsonParser, tokensAssignationAPI);
routes.post("/tokens-exchange", jsonParser, tokensExchangeAPI);

export default routes;
