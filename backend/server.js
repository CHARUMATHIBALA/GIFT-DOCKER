
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/auth",authRoutes)

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/giftshop"

mongoose.connect(MONGODB_URI)
.then(()=>app.listen(PORT,()=>console.log(`Server started on port ${PORT}`)))
.catch((error)=>console.error("Database connection failed:", error))
