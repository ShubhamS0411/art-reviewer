import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


export function refreshToken(req,res){
    try{
     const refreshToken = req.cookies.refreshToken;
     if(!refreshToken){
        return res.sendStatus(401).json({message: "Unauthorized"});
     }

     const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
     const accessToken = jwt.sign(user.sub, process.env.ACCESS_SECRET, {expiresIn: '15m'});
        res.cookie('accessToken', accessToken, {httpOnly: true, secure: true, sameSite: 'none'});
     }
    catch(error){
        console.error(error);
    }
}



