import {getMarketsPredictions} from "../models/getMarketsPredictions.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        topic: Joi.array().items(
            Joi.string().regex(
                new RegExp('^[a-z]+$')
            )
        ),
        offset: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(1)
    });
    try {
       const value = await schema.validateAsync(params)
    } catch (err) { 
        console.error(err)
        return false
    }
    return true;

}

export const getMarketsPredictionsController = async(req, res) => {
    console.log("predictions controller received request with params:");
    console.log(req.query);
    const params = req.query;

    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getMarketsPredictions(
            db,
            params
        );
        if(output === null){
            res.status(404).send(
                "no predictions exist for requested params"
            )
        }else{
            res.send(output);
        }
    }else{
        res.status(400).send(
            "invalid parameters for /parameter enpoint"
        )
    };
}