const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    photos: [
      {
        type: String // URL or file paths of images
      }
    ],
    videoUrls: [
      {
        type: String // YouTube or video links
      }
    ],
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);
