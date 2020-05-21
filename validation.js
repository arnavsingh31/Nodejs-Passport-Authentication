const Joi = require('@hapi/joi');
const userValidation = (data)=>{
    const Schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().token().min(8).max(20),
        password2: Joi.ref('password')
    });
     return Schema.validate(data, {abortEarly: false})
}

const loginValidation = (data)=>{
    const Schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.required().min(8).max(20)
    });
    return Schema.validate(data, {abortEarly: false})
}
module.exports = {userValidation, loginValidation};