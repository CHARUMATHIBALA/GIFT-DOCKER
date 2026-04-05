
import mongoose from "mongoose"

const schema = new mongoose.Schema({
userId:String,
products:Array,
total:Number,
status:{type:String,default:"processing"},
createdAt:{type:Date,default:Date.now}
})

export default mongoose.model("Order",schema)
