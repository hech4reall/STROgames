const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    bookingId: {type: mongoose.Schema.Types.ObjectId},
    prix: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected'], // Standardize casing
      default: 'pending'
    }
  });

const offer = mongoose.model('offer', OfferSchema);

module.exports = offer;