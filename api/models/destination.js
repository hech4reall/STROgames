const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    city: {type: String}
});

const destination = mongoose.model('destination', destinationSchema);

module.exports = destination;