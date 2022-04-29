import express from 'express';
import { viewVIT } from '../controllers/vit';

const router = express.Router();

router.get('/', viewVIT);

export default router;
