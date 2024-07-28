const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    aptSuite: {
        type: String,
        required: false, // Changed to false
        default: ''
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    guestCount: {
        type: Number,
        required: true,
        min: 1
    },
    bedroomCount: {
        type: Number,
        required: true,
        min: 1
    },
   
    amenities: {
        type: [String], // Adjust based on your needs
        default: []
    },
    listingPhotoPaths: [{ type: String }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    highlight: {
        type: String,
        required: true,
    },
    highlightDesc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price is not negative
    }
},
{ timestamps: true });

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
