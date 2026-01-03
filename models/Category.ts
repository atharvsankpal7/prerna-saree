import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);
