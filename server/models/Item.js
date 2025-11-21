import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'pending'],
    },
  },
  {
    timestamps: true,
  }
)

const Item = mongoose.model('Item', itemSchema)

export default Item

