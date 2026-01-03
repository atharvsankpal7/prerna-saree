import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  specs: {
    color: String,
    fabric: String,
    design: String,
    border: String,
    blouse: String,
  },
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);
