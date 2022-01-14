import express from 'express';
import Activity from '../models/Activity.js';
import verifyToken from '../middleware/auth.js';
import {
	authorizeViewActivity,
	authorizeCreateActivity,
	authorizeUpdateActivity,
	authorizeDeleteActivity
} from '../middleware/activity.js';

const router = express.Router();

router.get('/', verifyToken, authorizeViewActivity, async (req, res) => {
	try {
		const activities = await Activity.find();
		res.json({
			success: true,
			activities
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			err
		});
	}
});

router.post('/', verifyToken, authorizeCreateActivity, async (req, res) => {
	const {
		name,
		description,
		event,
		chief,
		enrolledMembers,
		participants,
		reference
	} = req.body;

	const newActivity = new Activity({
		name,
		description,
		event,
		chief,
		enrolledMembers,
		participants,
		reference
	});

	try {
		await newActivity.save();
		res.status(201).send({ success: true, data: newActivity });
	} catch (err) {
		res.status(400).send({
			success: false,
			err
		});
	}
});

router.put('/', verifyToken, authorizeUpdateActivity, async (req, res) => {
	const oldActivity = { _id: req.body._id };

	let newActivity = {
		name: req.body.name,
		description: req.body.description,
		event: req.body.event,
		chief: req.body.chief,
		enrolledMembers: req.body.enrolledMembers,
		participants: req.body.participants,
		reference: req.body.reference
	};

	newActivity = await Activity.findOneAndUpdate(oldActivity, newActivity, { new: true });

	if (!newActivity) res.status(400).send({ success: false });
	else res.status(200).send({ success: true, data: newActivity });
});

router.delete('/:id', verifyToken, authorizeDeleteActivity, async (req, res) => {
	res.status(200).send({ success: true, data: req.params.id });
});

export default router;
