import {getMarket} from "../models/getMarket.js";
import {
    db
} from "../models/mongo_setup.js";
import Joi from "joi";

import {logger} from "../logger.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        marketAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        ).required()
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getMarketController = async(req, res) => {
    const params = {
        'marketAddress': req.params.marketAddress
    };
    if(validateFields(params)){
        const output = await getMarket(
            db,
            params
        );
        logger.info(`output: ${output}`);
        return res.send(output);
    }else{
        res.status(400).send(error.details[0].message)
    };
}