import express from "express";
import {
  getMarketController,
} from "../controllers/getMarketController.js";
import {
  getMarketsController
} from "../controllers/getMarketsController.js";

import {
  getMarketUsersController
} from "../controllers/getMarketUsersController.js";

export let marketRouter = express.Router();

marketRouter.get('/', async (req, res) => {
  await getMarketsController(req, res);
});


marketRouter.get('/:marketAddress', async (req, res) => {
  await getMarketController(req, res);
});

marketRouter.get('/:marketAddress/users', async (req, res) => {
  await getMarketUsersController(req, res);
});

marketRouter.get('/predictions', async (req, res) => {
  await getMarketsPredictionsController(req, res);
});





