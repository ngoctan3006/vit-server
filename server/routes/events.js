import express from 'express';
import Event from '../models/Event.js';
import verifyToken from '../middleware/auth.js';
import {
	authorizeViewEvent,
	authorizeCreateEvent,
	authorizeUpdateEvent,
	authorizeDeleteEvent
} from '../middleware/event.js';

const router = express.Router();

router.get('/', verifyToken, authorizeViewEvent, async (req, res) => {
	try {
		const events = await Event.find();
		res.json({
			success: true,
			events
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			err
		});
	}
});

router.post('/', verifyToken, authorizeCreateEvent, async (req, res) => {
	const {
		name,
		description,
		chief,
		enrolledMembers,
		participants,
		reference
	} = req.body;

	const newEvent = new Event({
		name,
		description,
		chief,
		enrolledMembers,
		participants,
		reference
	});

	try {
		await newEvent.save();
		res.status(201).send({ success: true, data: newEvent });
	} catch (err) {
		res.status(400).send({
			success: false,
			err
		});
	}
});

router.put('/', verifyToken, authorizeUpdateEvent, async (req, res) => {
	const oldEvent = { _id: req.body._id };

	let newEvent = {
		name: req.body.name,
		description: req.body.description,
		chief: req.body.chief,
		enrolledMembers: req.body.enrolledMembers,
		participants: req.body.participants,
		reference: req.body.reference
	};

	newEvent = await Event.findOneAndUpdate(oldEvent, newEvent, { new: true });

	if (!newEvent) res.status(400).send({ success: false });
	else res.status(200).send({ success: true, data: newEvent });
});

router.delete('/:id', verifyToken, authorizeDeleteEvent, async (req, res) => {
	res.status(200).send({ success: true, data: req.params.id });
});

export default router;
