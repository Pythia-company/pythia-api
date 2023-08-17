import {getUserMarket} from "../models/getUserMarket.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        userAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        ).required(),
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

export const getUserMarketController = async(req, res) => {
    const params = {
        "userAddress" : req.params.userAddress,
        "marketAddress": req.params.marketAddress
    }
    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getUserMarket(db, params);
        if(output == null){
            return res.send({});
        }
        return res.send(output);
    }else{
        res.status(400).send("wrong request format")
    };
}