const express = require("express")
const createErrors = require("http-errors")
const bcrypt = require("bcrypt")
const routes = express.Router()
const UserModel = require("../userModels/user.model")
const {authSchema} = require("../helpers/newJoiSchema")

routes.post("/register", async(req,res,next)=> {
    try{
        const result = await authSchema.validateAsync(req.body)
        console.log(result)

        const doesExist = await UserModel.findOne({email:result.email})

        if (doesExist) throw createErrors.Conflict(result.email+" is already register")

        const user = new UserModel(result)
        const saveUsers = await user.save()

        res.send(saveUsers)

    }catch(error){
        if(error.isJoi === true) error.status = 422
        next(error)
    }
})

routes.post("/login", async(req,res,next)=>{
    try {
        const result = req.body
        
        if(!(result.email || result.password)) {
            throw createErrors.Conflict("please enter email address")
        }
        const doesExist = await UserModel.findOne({email: result.email})
        if(!doesExist) throw createErrors.NotFound("User dose not exist")
        
        const isMatch = await doesExist.isvalidPassword(result.password)
        if (!isMatch) throw createErrors.Unauthorized("email or password is not matched")

        res.send(result)

    } catch (error) {
        next(error)
    }
})

routes.patch("/update/password", async(req,res,next)=> {
    try {
        const result = req.body
        if(!result.email) throw createErrors.Conflict("please enter email address")
        
        const doesExist = await UserModel.findOne({email:result.email})
        if (!doesExist) throw createErrors.Conflict("that User is not exist")
        
        // hashing password this is middleware function
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(result.password, salt)
        result.password = hashPassword

        // for update password
        const updatedUser = await UserModel.updateOne({password:result.password})
        const see = await UserModel.findOne(updatedUser)

        if(updatedUser) res.send(see)
        
    } catch (error) {
        next(error)
    }
})

module.exports = routes
