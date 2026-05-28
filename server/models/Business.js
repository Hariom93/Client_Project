const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: '',
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        userName: {
          type: String,
          default: ''
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          default: ''
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Pre-save rating calculator hook
BusinessSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
  } else {
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model('Business', BusinessSchema);
