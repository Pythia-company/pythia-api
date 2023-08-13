import {getMarkets} from "../models/getMarkets.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        topics: Joi.array().items(
            Joi.string().regex(
                new RegExp('^0x([a-fA-F0-9]+)?$')
            )
        ),
        createdAfter: Joi.number().integer().min(0),
        wageDeadlineAfter: Joi.number().integer().min(0),
        resolvesAfter: Joi.number().integer().min(0),
        status: Joi.string().valid('inprogress', 'unresolved', 'resolved'),
        questionPattern: Joi.string().regex(
            new RegExp('^[a-z //]+$')
        ),
        sort: Joi.object().keys({
            wageDeadline : Joi.string().valid("asc", "desc"),
            resolutionDate: Joi.string().valid("asc", "desc"),
            numOfPredictors : Joi.string().valid("asc", "desc"),
        }),
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(0)
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getMarketsController = async(req, res) => {
    const params = req.query;
    if(validateFields(params)){
        const output = await getMarkets(
            db,
            params
        );
        if(output == null){
            return res.status(204).send({})
        }
        return res.send(output);
    }else{
        res.status(400).send(error.details[0].message)
    };
}