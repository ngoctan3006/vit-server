import express from 'express';
import dotenv from 'dotenv';
import verifyToken from '../middleware/auth.js';
import { authorizeViewGroup } from '../middleware/group.js';
import Group from '../models/Group.js';

const router = express.Router();

dotenv.config();

router.get('/', verifyToken, authorizeViewGroup, async (req, res) => {
	try {
		const groups = await Group.find();
		res.json({
			success: true,
			groups
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Internal server error'
		});
	}
});

export default router
