const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required']
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required']
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage / GPA is required'],
      min: 0,
      max: 100
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required']
    },
    annualIncome: {
      type: Number,
      required: [true, 'Annual family income is required']
    },
    incomeCertificate: {
      type: String,
      default: '' // File path or URL
    },
    marksheet: {
      type: String,
      default: '' // File path or URL
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'approved', 'rejected'],
      default: 'pending'
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
