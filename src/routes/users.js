import express from "express";
import {
  getUserController,
} from "../controllers/getUserController.js";

import {
  getUsersController
} from "../controllers/getUsersController.js";

import {
  getUserMarketsController
} from "../controllers/getUserMarketsController.js";

import {
  getUserStatsController
} from "../controllers/getUserStatsController.js";

import {
  getUserMarketController
} from "../controllers/getUserMarketController.js";

export let userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  await getUsersController(req, res);
});


userRouter.get('/:userAddress', async (req, res) => {
  await getUserController(req, res);
});

userRouter.get('/stats/:userAddress', async (req, res) => {
  await getUserStatsController(req, res);
});


userRouter.get('/:userAddress/markets/:marketAddress', async (req, res) => {
  await getUserMarketController(req, res);
});


userRouter.get('/:userAddress/markets', async (req, res) => {
  await getUserMarketsController(req, res);
});





