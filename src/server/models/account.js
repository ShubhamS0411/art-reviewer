// models/account.js

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
    {
        account_type: {
            type: [String], 
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        upi: {
            type: String,
            default: '',
        },
        refreshToken: {
            type: [String], // To store multiple refresh tokens if needed
            default: [],
        },
        verificationToken: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const accountModel = mongoose.model('Account', accountSchema);

export default accountModel;
