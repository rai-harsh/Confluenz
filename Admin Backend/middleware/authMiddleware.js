import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = decoded; // Attach decoded user info to the request object
        next();
    });
};