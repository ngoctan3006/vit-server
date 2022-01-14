import express from 'express';
import Club from '../models/Club.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await Club.find();
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
});

export default router;
