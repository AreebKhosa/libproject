const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const userModel = new Schema({
    email:{
        type: String,
        required: true,
        lowercase:true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
})

userModel.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()
    }catch(error){

    }
})

userModel.methods.isvalidPassword = async function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const UserModel = mongoose.model('user',userModel)
module.exports = UserModel
