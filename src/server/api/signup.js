// controllers/auth.js

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import accountModel from '../models/account.js';

dotenv.config();

const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

export const signup = async (req, res) => {
    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;

    try {
        let { account_type, username, email, password, upi } = req.body;

        const improvedUsername = username?.trim();
        const improvedEmail = email?.trim()?.toLowerCase();
        const improvedPassword = password?.trim();

        if (!improvedUsername || !improvedEmail || !improvedPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailExists = await accountModel.findOne({ email: improvedEmail });
        const usernameExists = await accountModel.findOne({ username: improvedUsername });

        if (emailExists || usernameExists) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(improvedPassword, 10);
        const verificationToken = generateVerificationToken();

        const newAccount = new accountModel({
            account_type: account_type,
            username: improvedUsername,
            email: improvedEmail,
            password: hashedPassword,
            upi: upi || '',
            verificationToken,
            isVerified: true,
        });

        const savedAccount = await newAccount.save();

        const payload = { sub: savedAccount.username, role: savedAccount.account_type };
        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

        await accountModel.updateOne(
            { username: savedAccount.username },
            { $set: { refreshToken: [refreshToken] } }
        );

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
            maxAge: 15 * 60 * 1000,
        });

        return res.status(201).json({
            message: 'Account created successfully, please login.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
