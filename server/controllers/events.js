import Event from '../models/Event.js';

export const viewAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json({
            success: true,
            data: newEvent
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const updateEvent = async (req, res) => {
    const { id: _id } = req.params;
    const newEvent = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(_id, newEvent, {
            new: true
        });
        res.json({
            success: true,
            data: updatedEvent
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
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            _id,
            {
                $addToSet: {
                    enrolledMembers: userIds
                }
            },
            {
                new: true
            }
        );
        res.json({
            success: true,
            data: updatedEvent
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
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            _id,
            { $addToSet: { participants: userIds } },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedEvent
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
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            _id,
            { $pull: { enrolledMembers: { $in: userIds } } },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedEvent
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
    const { userIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            _id,
            { $pull: { participants: { $in: userIds } } },
            { new: true }
        );
        res.json({
            success: true,
            data: updatedEvent
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteEvent = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send(`No event found with ID: ${_id}`);

    try {
        const deletedEvent = await Event.findByIdAndDelete(_id);
        res.json({
            success: true,
            data: deletedEvent
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
