import express from 'express';
import VIT from '../models/VIT.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await VIT.find();
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
