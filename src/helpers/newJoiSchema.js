const joi = require('joi')

const authSchema = joi.object({
    email: joi.string().pattern(new RegExp('@gmail.com')).lowercase().required(),
    password: joi.string().min(6).required()
})

module.exports = {
    authSchema
}