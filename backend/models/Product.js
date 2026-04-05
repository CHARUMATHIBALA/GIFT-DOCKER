
import mongoose from "mongoose"

const schema = new mongoose.Schema({
name:String,
price:Number,
image:String,
category:String,
description:String
})

export default mongoose.model("Product",schema)
