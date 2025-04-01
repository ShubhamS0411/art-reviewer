import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import account from '../models/account.js';
dotenv.config();



export const signup = async(req, res) => {
    try {   
        let { account_type, username, email, password } = req.body;

        const imporvedUsername = username?.trim();
        const improvedEmail = email?.trim()?.toLowerCase();
        const improvedpassword = password?.trim();
        
        if(!imporvedUsername || !improvedEmail || !improvedpassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailExists = await account.findOne({email: improvedEmail});
        const usernameExists = await account.findOne({username});

       
        if(emailExists || usernameExists) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new account({
            account_type,
            username,
            email: improvedEmail,
            password: hashedPassword,
        });
        await newAccount.save();
        res.status(201).json({ message: 'Account created successfully' });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

