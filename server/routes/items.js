import express from 'express'
import Item from '../models/Item.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      status: item.status,
    }))

    res.json(formattedItems)
  } catch (error) {
    console.error('Get items error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router

