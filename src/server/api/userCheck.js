import jwt from 'jsonwebtoken';

export default function userCheck(req, res) {
    try{
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decode = jwt.decode(accessToken);
        const username = decode.sub;
        res.status(200).json({ message: 'Authorized', username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking user' });
    }
}