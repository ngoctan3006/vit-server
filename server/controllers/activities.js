import Activity from '../models/Activity.js';

export const viewAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createActivity = async (req, res) => {
    try {
        const newActivity = new Activity(req.body);

        await newActivity.save();
        res.status(201).json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateActivity = async (req, res) => {
    const { id: _id } = req.params;

    const newActivity = req.body;

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(_id, newActivity, {
            new: true
        });

        res.json({
            success: true,
            data: updatedActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const enrollMembers = async (req, res) => {
    const { id: _id } = req.params;

    try {
        const newActivity = await Activity.findByIdAndUpdate(
            _id,
            { $addToSet: { enrolledMembers: req.body.userIds } },
            { new: true }
        );
        res.json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const addParticipants = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const newActivity = await Activity.findByIdAndUpdate(
            _id,
            { $addToSet: { participants: req.body.userIds } },
            { new: true }
        );
        res.json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const removeEnrolledMembers = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const newActivity = await Activity.findByIdAndUpdate(
            _id,
            { $pull: { enrolledMembers: { $in: req.body.userIds } } },
            { new: true }
        );
        res.json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const removeParticipants = async (req, res) => {
    const { id: _id } = req.params;
    try {
        const newActivity = await Activity.findByIdAndUpdate(
            _id,
            { $pull: { participants: { $in: req.body.userIds } } },
            { new: true }
        );
        res.json({
            success: true,
            data: newActivity
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteActivity = async (req, res) => {
    const { id: _id } = req.params;
    try {
        await Activity.findByIdAndDelete(_id);
        res.json({
            success: true
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
