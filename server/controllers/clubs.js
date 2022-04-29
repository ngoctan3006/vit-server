import Club from '../models/Club.js';

export const viewAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json({
            success: true,
            data: clubs
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createClub = async (req, res) => {
    try {
        const newClub = new Club(req.body);
        await newClub.save();

        res.status(201).json({
            success: true,
            data: newClub
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
