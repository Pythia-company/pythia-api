import {getMarkets} from "../models/getMarkets.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        topics: Joi.array().items(
            Joi.string().regex(
                new RegExp('^[a-z]+$')
            )
        ),
        createdAfter: Joi.number().integer().min(0),
        wageDeadlineAfter: Joi.number().integer().min(0),
        resolvesAfter: Joi.number().integer().min(0),
        status: Joi.string().valid('inprogress', 'unresolved', 'resolved'),
        questionPattern: Joi.string().regex(
            new RegExp('^[a-zA-Z //]+$')
        ),
        sort: Joi.object().keys({
            wageDeadline : Joi.string().valid("asc", "desc"),
            resolutionDate: Joi.string().valid("asc", "desc"),
            numOfPredictors : Joi.string().valid("asc", "desc"),
        }),
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(0),
        userAddress: Joi.string().regex(
            new RegExp('^0x([a-fA-F0-9]+)?$')
        )
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
    console.log("markets controller received request with params:");
    console.log(req.query);
    const params = req.query;

    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getMarkets(
            db,
            params
        );
        console.log("output for markets/")
        console.log(console.log(JSON.stringify(output['data'][0], null, 4)));
        if(output === null){
            res.status(404).send(
                "markets with requested params do not exist"
            )
        }else{
            res.send(output);
        }
    }else{
        res.status(400).send(
            "invalid parameters for /markets enpoint"
        )
    };
}