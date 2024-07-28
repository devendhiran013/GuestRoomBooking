const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Ensures email is stored in lowercase
        },
        password: {
            type: String,
            required: true,
        },
        tripList: {
            type: Array,
            default: [],
        },
        wishList: {
            type: Array,
            default: [],
        },
        propertyList: {
            type: Array,
            default: [],
        },
        reservationList: {
            type: Array,
            default: [],
        },
        role: { // Added role field
            type: String,
            enum: ['user', 'admin'], // Role can be either 'user' or 'admin'
            default: 'user', // Default role is 'user'
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
