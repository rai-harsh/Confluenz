// CONFLUENZ PORTFOLIO/Confluenz back/middleware/verifyToken.js
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded; // Store decoded data in request object for use in routes
        next();
    });
};

module.exports = verifyToken;
