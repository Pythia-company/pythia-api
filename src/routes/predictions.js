import express from "express";
import {
    getMarketsPredictionsController
} from "../controllers/getMarketsPredictionsController.js";

export let predictionsRouter = express.Router();

predictionsRouter.get('/', async (req, res) => {
    await getMarketsPredictionsController(req, res);
});