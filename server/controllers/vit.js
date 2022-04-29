import VIT from '../models/VIT.js';

export const viewVIT = async (req, res) => {
    try {
        const vit = await VIT.find();
        res.json({
            success: true,
            data: vit
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
