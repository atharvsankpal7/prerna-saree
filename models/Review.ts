import mongoose, { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: String,
  videoLink: String,
  comment: String,
  images: [String],
  isApproved: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Review = models.Review || model('Review', ReviewSchema);
