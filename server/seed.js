import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Item from './models/Item.js'
import connectDB from './config/database.js'

dotenv.config()

const seedData = async () => {
  try {
    await connectDB()

    try {
      await User.deleteMany({})
      await Item.deleteMany({})
    } catch (deleteError) {
      console.log('Note: Could not delete existing data (may require auth)')
    }

    const users = await User.insertMany([
      {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      },
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
      },
      {
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
      },
    ])

    console.log(`Created ${users.length} users:`)
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.name})`)
    })

    const items = await Item.insertMany([
      {
        name: 'Item 1',
        description: 'Description for item 1',
        status: 'active',
      },
      {
        name: 'Item 2',
        description: 'Description for item 2',
        status: 'active',
      },
      {
        name: 'Item 3',
        description: 'Description for item 3',
        status: 'pending',
      },
      {
        name: 'Item 4',
        description: 'Description for item 4',
        status: 'inactive',
      },
      {
        name: 'Item 5',
        description: 'Description for item 5',
        status: 'active',
      },
    ])

    console.log(`Created ${items.length} items`)

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedData()

