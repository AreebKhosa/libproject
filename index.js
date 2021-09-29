const express = require("express")
const createErrors = require("http-errors")
const UserRotues = require("./src/routes/app.routes")
require("./src/helpers/conn")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.json({
        "mes" : "hello",
        "and": "harami"
    })
})

app.use("/user",UserRotues)

app.use(async(req,res,next)=>{
    await next(createErrors.NotFound())
})

// all error come here

app.use((err,req,res,next) =>{
    res.status(err.status || 500)
    res.send({
        error: {
            status:err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log("app is running on ",PORT)
})