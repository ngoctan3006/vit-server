import express from 'express';
import Group from '../models/Group.js';
import verifyToken from '../middleware/auth.js';
import {
	authorizeViewGroup,
	authorizeCreateGroup,
	authorizeUpdateGroup,
	authorizeDeleteGroup
} from '../middleware/group.js';

const router = express.Router();

router.get('/', verifyToken, authorizeViewGroup, async (req, res) => {
	try {
		const groups = await Group.find();
		res.json({
			success: true,
			groups
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
			err
		});
	}
});

router.post('/', verifyToken, authorizeCreateGroup, async (req, res) => {
	const { name, description, chief, vice, members, reference } = req.body;

	const newGroup = new Group({
		name,
		description,
		chief,
		vice,
		members,
		reference
	});

	try {
		await newGroup.save();
		res.status(201).send({ success: true, data: newGroup });
	} catch (err) {
		res.status(400).send({
			success: false,
			err
		});
	}
});

router.put('/', verifyToken, authorizeUpdateGroup, async (req, res) => {
	const oldGroup = { _id: req.body._id };

	let newGroup = {
		name: req.body.name,
		description: req.body.description,
		chief: req.body.chief,
		vice: req.body.vice,
		members: req.body.members,
		reference: req.body.reference
	};

	newGroup = await Group.findOneAndUpdate(oldGroup, newGroup, { new: true });

	if (!newGroup) res.status(400).send({ success: false });
	else res.status(200).send({ success: true, data: newGroup });
});

router.delete('/:id', verifyToken, authorizeDeleteGroup, async (req, res) => {
	res.status(200).send({ success: true, data: req.params.id });
});

export default router;
