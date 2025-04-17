import jwt from 'jsonwebtoken';
import accountModel from '../models/account.js';
export async function profileEdit(req, res) {
    try {
        const {upi} = req.body;
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
       
        const decode = jwt.decode(accessToken);
        const sessionUserName = decode.sub;
        
        
        await accountModel.findOneAndUpdate({ username: sessionUserName }, { upi: upi }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);    
        res.status(500).json({ message: 'Error checking user' });
    }
}