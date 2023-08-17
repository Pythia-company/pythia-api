import {getUserMarkets} from "../models/getUserMarkets.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        userAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        ).required(),
        resolved: Joi.boolean(),
        receivedReward: Joi.boolean(),
        order: Joi.string().valid('asc','desc'),
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(0),
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getUserMarketsController = async(req, res) => {
    const params = req.query;
    params["userAddress"] = req.params.userAddress;
    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getUserMarkets(db, params);
        if(output == null){
            return res.send([]);
        }
        return res.send(output);
    }else{
        res.status(400).send("wrong request format")
    };
}