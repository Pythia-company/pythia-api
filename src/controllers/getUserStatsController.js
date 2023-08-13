import {getUserStats} from "../models/getUserStats.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        userAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        ).required(),
        topic: Joi.string().regex(
            new RegExp('^[a-z]+$')
        ).required(),
        periodDays: Joi.number().integer().min(0),
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getUserStatsController = async(req, res) => {
    const params = req.query;
    params["userAddress"] = req.params.userAddress;

    if(validateFields(params)){
        const output = await getUserStats(db, params);
        if(output == null){
            return res.status(204).send({});
        }
        return res.send(output);
    }else{
        res.status(400).send(error.details[0].message)
    };
}