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
    const params = req.query;
    if(validateFields(params)){
        const soutput = await getUsers(db, params);
        return res.send(output);
    }else{
        res.status(400).send(error.details[0].message)
    };
}

