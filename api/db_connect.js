const mongoose = require("mongoose");

const URI = process.env.URI;

async function connect() {
    try {
        await mongoose.connect(URI, {
            dbName: "Bus",
        })
    
        console.log("Connected to mongo");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connect;