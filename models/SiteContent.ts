import mongoose, { Schema, model, models } from 'mongoose';

const SiteContentSchema = new Schema({
  heroImages: {
    type: [String],
    default: [],
  },
  influencerVideos: [{
    url: String,
    creatorName: String,
    reviewSummary: String,
  }],
  dispatchVideos: [{
    url: String,
    thumbnail: String,
  }],
}, { timestamps: true });

// We'll treat this as a singleton, typically fetching the first document
export const SiteContent = models.SiteContent || model('SiteContent', SiteContentSchema);
