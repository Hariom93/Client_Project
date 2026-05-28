const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    googleId: {
      type: String,
      default: '',
      index: true
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending' // Admins approve new members
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    familyDetails: {
      fatherName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      gotra: { type: String, default: '' },
      spouseName: { type: String, default: '' }
    },
    occupation: {
      title: { type: String, default: '' },
      company: { type: String, default: '' },
      city: { type: String, default: '' }
    },
    education: {
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      graduationYear: { type: Number, default: null }
    }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
