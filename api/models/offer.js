const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    prix: {type: String},
    status: {type: String,
        required: true,
        enum: ['pending','accepted', 'Rejected'],
        default: 'pending'
    }
    
});

const offer = mongoose.model('offer', OfferSchema);

module.exports = offer;