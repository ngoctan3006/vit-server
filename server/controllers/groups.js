import Group from '../models/Group.js';

export const viewAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json({
            success: true,
            data: groups
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createGroup = async (req, res) => {
    try {
        const newGroup = new Group(req.body);
        await newGroup.save();
        res.json({
            success: true,
            data: newGroup
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateGroup = async (req, res) => {
    const { id: _id } = req.params;
    const newGroup = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No group found with ID: ${_id}`);

    try {
        const updatedGroup = await Group.findByIdAndUpdate(_id, newGroup, {
            new: true
        });
        res.json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const addMembers = async (req, res) => {
    const { id: _id } = req.params;
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No group found with ID: ${_id}`);

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            _id,
            {
                $push: {
                    members: {
                        $each: userIds
                    }
                }
            },
            {
                new: true
            }
        );
        res.json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const removeMembers = async (req, res) => {
    const { id: _id } = req.params;
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No group found with ID: ${_id}`);

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            _id,
            {
                $pull: {
                    members: {
                        $in: userIds
                    }
                }
            },
            {
                new: true
            }
        );
        res.json({
            success: true,
            data: updatedGroup
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const removeGroup = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No group found with ID: ${_id}`);

    try {
        await Group.findByIdAndDelete(_id);
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
