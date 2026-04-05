
import express from "express"
import Order from "../models/Order.js"
import { auth, adminAuth } from "../middleware/auth.js"

const router = express.Router()

router.post("/", auth, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user.userId
    })

    setTimeout(async () => {
      order.status = "delivered"
      await order.save()
    }, 20000)

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
