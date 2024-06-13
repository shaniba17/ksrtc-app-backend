const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {busmodel}=require("./models/SignUp")
const bcrypt=require("bcryptjs")
const jwt =require("jsonwebtoken")

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


app.post("/login",(req,res)=>{
    let input =req.body
    busmodel.find({"emailid":req.body.emailid}).then(
        (response)=>{
            if(response.length>0)
                {
                    let dbPassword=response[0].password
                    console.log(dbPassword)
                    bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                        if (isMatch) {
                            jwt.sign({email:input.emailid},"bus-app",{expiresIn:"2d"},
                                (error,token)=>{
                                if (error) {
                                    res.json({"status":"unable to create token"})
                                } else {
                                    res.json({"status":"success","userid":response[0]._id,"token":token})
                                }
                            })
                        } else {
                            res.json({"status":"incorrect password"})
                        }
                    })
                }
            else{
                res.json({"status":"user not found"})
            }
        }
    )
    })
    
    app.post("/view",(req,res)=>{
        let token = req.headers["token"]
        jwt.verify(token,"bus-app",(error,decoded)=>{
            if (error) {
                res.json({"status":"unauthorized access"})
            } else {
                if(decoded)
                    {
                        busmodel.find().then(
                            (response)=>{
                                res.json(response)
                            }
                        ).catch()
                    }
            }
        })
        
    })




app.listen(8080,()=>
{
    console.log("server started")
})