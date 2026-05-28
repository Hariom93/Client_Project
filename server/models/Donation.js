const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Guest donations are possible
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Donation amount must be greater than 0']
    },
    paymentId: {
      type: String,
      default: '' // Razorpay order / transfer reference
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    message: {
      type: String,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
