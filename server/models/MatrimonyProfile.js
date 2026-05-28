const mongoose = require('mongoose');

const MatrimonyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required']
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    height: {
      type: String,
      default: '' // E.g. "5'8\""
    },
    gotraSelf: {
      type: String,
      required: [true, 'Self Gotra is required'],
      trim: true
    },
    gotraMother: {
      type: String,
      required: [true, "Mother's Gotra is required"],
      trim: true
    },
    education: {
      type: String,
      default: ''
    },
    profession: {
      type: String,
      default: ''
    },
    income: {
      type: String,
      default: '' // E.g. "5-10 LPA"
    },
    city: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      default: ''
    },
    aboutMe: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'hidden'],
      default: 'active'
    },
    contactRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MatrimonyProfile', MatrimonyProfileSchema);
