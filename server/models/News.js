const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'News content is required']
    },
    image: {
      type: String,
      default: ''
    },
    pinned: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['general', 'scholarship', 'marriage', 'notice'],
      default: 'general'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', NewsSchema);
