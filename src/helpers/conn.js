const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/lib_DataBase",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("connected to mogodb")
}).catch((err)=>{
    console.log(e)
})

mongoose.connection.on('connected',()=>{
    console.log("mangoose connection success")
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
})

mongoose.connection.on('disconnected',()=>{
    console.log("mangoose disconnection success")
})

process.on('SIGINT', async()=> {
    await mongoose.connection.close()
    process.exit(0)
})