import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import accountModel from '../models/account.js';
import jwt from 'jsonwebtoken';

dotenv.config();

export const signin = async (req, res) => {
    const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

    if (!ACCESS_SECRET || !REFRESH_SECRET) {
        console.error('Missing secrets');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const { username, password } = req.body;

        const improvedUsername = username?.trim();
        const improvedPassword = password?.trim();

        if (!improvedUsername || !improvedPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const accountExists = await accountModel.findOne({ username });
        if (!accountExists) {
            return res.status(404).json({ message: 'Account does not exist' });
        }

        const passwordVerify = await bcrypt.compare(password, accountExists.password);
        if (!passwordVerify) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        const payload = { sub: accountExists.username, role: accountExists.account_type };
        

        const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

        await accountModel.updateOne(
            { username: accountExists.username },
            { $set: { refreshToken } }
        );

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // Set to true in production with HTTPS
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};