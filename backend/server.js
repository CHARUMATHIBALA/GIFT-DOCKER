
import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/auth",authRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/giftshop")
.then(()=>app.listen(5000,()=>console.log("Server started")))
