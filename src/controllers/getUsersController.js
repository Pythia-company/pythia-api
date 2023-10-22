import {getUsers} from "../models/getUsers.js";
import Joi from "joi";
import {
    db
} from "../models/mongo_setup.js";

export const validateFields = async (params) => {
    const schema =  Joi.object({
        topic: Joi.string().regex(
            new RegExp('^[a-z]+$')
        ).required(),
        periodDays: Joi.number().integer().min(0),
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

export const getUsersController = async(req, res) => {
    console.log("markets controller received request with params:");
    console.log(req.query);
    const params = req.query;

    const paramsValid = await validateFields(params);
    if(paramsValid){
        const output = await getUsers(db, params);
        if(output === null){
            res.status(404).send(
                "no users exist for requested params"
            )
        }else{
            res.send(output);
        }
    }else{
        res.status(400).send("wrong request format")
    };
}

