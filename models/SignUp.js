const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "name":{type:String,required:true},
        "emailid":{type:String,required:true},
        "gender":{type:String,required:true},
        "password":{type:String,required:true},
        "confirmpassword":{type:String,required:true},
    }
)

let busmodel=mongoose.model("bususers",schema);
module.exports={busmodel}