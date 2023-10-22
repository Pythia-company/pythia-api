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
    console.log("market controller received request with params:");
    console.log(req.params);
    const params = {
        'marketAddress': req.params.marketAddress
    };
    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getMarket(
            db,
            params
        );
        if(output === null){
            res.status(404).send(
                "market with requested params do not exist"
            )
        }else{
            res.send(output);
        }
    }else{
        res.status(400).send("wrong request format")
    };
}