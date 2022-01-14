import express from 'express';
import Club from '../models/Club.js';
import verifyToken from '../middleware/auth.js';

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

router.post('/', verifyToken, async (req, res) => {
    const { name, department, description, chief, vice, members, reference } =
        req.body;

    const newClub = new Club({
        name,
        department,
        description,
        chief,
        vice,
        members,
        reference
    });

    try {
        await newClub.save();
        res.status(201).send({ success: true, data: newClub });
    } catch (err) {
        res.status(400).send({
            success: false,
            err
        });
    }
});

export default router;
