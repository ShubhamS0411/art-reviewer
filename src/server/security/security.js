import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            return res.status(401).clearCookie('accessToken').json({ message: 'No refresh token provided' });
        }

        const { REFRESH_SECRET, ACCESS_SECRET } = process.env;
        if (!REFRESH_SECRET || !ACCESS_SECRET) {
            console.error('Missing JWT secrets');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const payload = { sub: user.sub, role: user.role };
            console.log('Refresh payload:', payload);

            const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
            console.log('New access token:', accessToken);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false, // Set to true in production with HTTPS
                maxAge: 15 * 60 * 1000,
            });

            return res.status(200).json({ message: 'Access token refreshed' });
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};