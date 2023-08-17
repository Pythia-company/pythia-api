import {getMarketUsers} from "../models/getMarketUsers.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        marketAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        ).required(),
        order: Joi.string().valid("asc", "desc"),
        offset: Joi.number().integer().min(0),
        limig: Joi.number().integer().min(0)
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getMarketUsersController = async(req, res) => {
    const params = req.query;
    params['marketAddress'] = req.params.marketAddress;

    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getMarketUsers(db, params);
        if(output == null){
            return res.send([]);
        }
        return res.send(output);
    }else{
        res.status(400).send(error.details[0].message)
    };
}