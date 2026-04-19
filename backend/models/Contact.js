const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contactUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nickname: {
    type: String,
    default: ''
  },
  trustLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate contacts
ContactSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });

module.exports = mongoose.model('Contact', ContactSchema);
