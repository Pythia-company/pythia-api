import {express} from "express";
import {
  getUser,
} from "../controllers/getUser.mjs";

import {
  getUsers
} from "../controllers/getUsers.mjs";

import {
  getUserMarkets
} from "../controllers/getUserMarkets.mjs";

import {
  getUserStats
} from "../controllers/getUserStats.mjs";

import {
  getUserMarket
} from "../controllers/getUserMarket.mjs";

import {
  db
} from "../models/mongo_setup.mjs";

export let userRouter = express.Router();

userRouter.get('/users', async (req, res) => {
  const responseData = await getUsers(db, req.query)
  res.send(responseData);
});


userRouter.get('/users/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress; 
  const queryParams = req.query;
  queryParams['userAddress'] = userAddress;
  const responseData = await getUsers(db, queryParams);
  res.send(responseData);
});

userRouter.get('/users/stats/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress; 
  const queryParams = req.query;
  queryParams['userAddress'] = userAddress;
  const responseData = await getUserStats(db, queryParams);
  res.send(responseData);
});


userRouter.get('/users/:userAddress/market/:marketAddress', async (req, res) => {
  const userAddress = req.params.userAddress; 
  const marketAddress = req.params.marketAddress; 
  const queryParams = req.query;
  queryParams['marketAddress'] = marketAddress;
  queryParams['userAddress'] = userAddress;
  const responseData = await getUserMarket(db, queryParams);
  res.send(responseData);
});


userRouter.get('/users/:userAddress/markets', async (req, res) => {
  const userAddress = req.params.userAddress; 
  const queryParams = req.query;
  queryParams['userAddress'] = userAddress;
  const responseData = await getUserMarkets(db, queryParams);
  res.send(responseData);
});





