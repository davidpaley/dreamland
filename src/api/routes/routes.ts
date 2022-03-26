import { Router } from "express";
import { tokenInput } from "../controllers/tokenInput";

import bodyParser from "body-parser";

var jsonParser = bodyParser.json();

const routes = Router();

routes.post("/tokenInput", jsonParser, tokenInput);

export default routes;
