const mongoose = require('mongoose');

const BusBookingSchema = new mongoose.Schema({
    nomComplet: {
        type: String,
        required: true,
    },
    userId: {type: mongoose.Schema.Types.ObjectId},
    email: {
        type: String,
        required: true,
        unique: false,
        lowercase: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    typeDuBus: { 
        type: String,
        required: true,
        enum: ['comfort', 'simple']
    },
    dateDepart: {
        type: Date,
        required: true
    },
    dateRetour: {
        type: Date,
        required: true
    },
    nbPlaces: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BusBooking = mongoose.model('BusBooking', BusBookingSchema);

module.exports = BusBooking;