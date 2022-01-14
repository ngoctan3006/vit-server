import express from 'express';
import Vit from '../models/Vit.js';
import verifyToken, { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await Vit.find();
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
});

export default router;
