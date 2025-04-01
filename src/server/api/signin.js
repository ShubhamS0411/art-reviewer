import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import accountModel from '../models/account.js';
import jwt from 'jsonwebtoken';

dotenv.config();

export const signin = async(req, res) => {

    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    const refreshedTokens = [];
    try{

        let { username , password } = req.body;

        const imporvedUsername = username?.trim();
        const imporvedPassword = password?.trim();

        if(!imporvedUsername || !imporvedPassword) {
           return res.status(400).json({ message: 'All fields are required' });
        }

        const accountExists = await accountModel.findOne({username});
        if(!accountExists){
           return res.status(404).json({ message: 'Account does not exist' });
        }

        const passwordVerify = await bcrypt.compare(password, accountExists.password);
        if(!passwordVerify){
            return res.status(401).json({message: "Password does not match"});
        }
       
        const payload = {sub: accountExists.username, role: accountExists.account_type};
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {expiresIn: '7d'});
        refreshedTokens.push(refreshToken);
        await accountModel.updateOne({username: accountExists.username}, {$set: {refreshToken: refreshToken}});

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
        

       

        return res.status(200).json({message: "Login successful"});
    }

    catch(error){
        console.error(error);    
        res.status(500).json({message: "Internal Server Error"});
    }

};

