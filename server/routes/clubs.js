import express from 'express';
import { createClub, viewAllClubs } from '../controllers/clubs.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', viewAllClubs);
router.post('/', verifyToken, createClub);

export default router;
