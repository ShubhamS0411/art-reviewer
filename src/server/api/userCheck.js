import jwt from 'jsonwebtoken';
import accountModel from '../models/account.js';

export default async function userCheck(req, res) {
    try{
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decode = jwt.decode(accessToken);
        const username = decode.sub;
        const userExsists = await accountModel.findOne({ username: username });
        if(!userExsists){
             return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ message: 'Authorized', username, userExsists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking user' });
    }
}