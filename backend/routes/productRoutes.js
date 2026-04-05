
import express from "express"
import Product from "../models/Product.js"
import { adminAuth } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query
    let filter = {}

    if (search) filter.name = { $regex: search, $options: "i" }
    if (category) filter.category = category

    const products = await Product.find(filter)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", adminAuth, upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      image: req.file ? req.file.path : req.body.image || 'https://via.placeholder.com/500x500'
    }
    
    const product = await Product.create(productData)
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id", adminAuth, upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price)
    }
    
    if (req.file) {
      productData.image = req.file.path
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    )
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
