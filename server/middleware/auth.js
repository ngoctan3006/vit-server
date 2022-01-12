import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'acces token not found'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.username = decoded.username;
        req.position = decoded.position;
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (!req.position.includes('admin'))
        return res.status(403).json({
            success: false,
            message: 'Not admin'
        });
    next();
};

export default verifyToken;
