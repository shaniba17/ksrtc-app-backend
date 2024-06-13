const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {busmodel}=require("./models/SignUp")
const bcrypt=require("bcryptjs")

mongoose.connect("mongodb+srv://shanibatm17:shaniba17tm@cluster0.h4a3e.mongodb.net/busdb?retryWrites=true&w=majority&appName=Cluster0")

const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword = async(password)=>{
const salt = await bcrypt.genSalt(10)
return bcrypt.hash(password,salt)
}

app.post("/signup",async(req,res)=>
{
    let input = req.body
    if (input.password!=input.confirmpassword) {
        res.json({"status":"password do not match"})
    } else {
        let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let bususers = new busmodel(input)
    bususers.save()
    res.json({"status":"SignUp"})
    }
})

app.listen(8080,()=>
{
    console.log("server started")
})