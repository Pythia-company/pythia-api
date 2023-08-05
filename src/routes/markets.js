import {express} from "express";
import {
  getMarket,
} from "../controllers/getMarket.mjs";

import {
  getMarkets
} from "../controllers/getmarkets.mjs";

import {
  getMarketUsers
} from "../controllers/getMarketmarkets.mjs";

import {
  db
} from "../models/mongo_setup.mjs";

export let marketRouter = express.Router();

marketRouter.get('/markets', async (req, res) => {
  const responseData = await getMarkets(db, req.query)
  res.send(responseData);
});


marketRouter.get('/markets/:marketAddress', async (req, res) => {
  const marketAddress = req.params.marketAddress; 
  const queryParams = req.query;
  queryParams['marketAddress'] = marketAddress;
  const responseData = await getMarkets(db, queryParams);
  res.send(responseData);
});

marketRouter.get('/market/:marketAddress/users', async (req, res) => {
  const marketAddress = req.params.marketAddress; 
  const queryParams = req.query;
  queryParams['marketAddress'] = marketAddress;
  const responseData = await getMarketUsers(db, queryParams);
  res.send(responseData);
});





